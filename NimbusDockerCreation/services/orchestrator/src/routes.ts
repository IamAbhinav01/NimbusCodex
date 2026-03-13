import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { startEnvironmentContainer, stopAndRemoveContainer } from './docker';

const router = Router();

const createSessionSchema = z.object({
  env: z.string().min(1)
});

// CREATE SESSION
router.post('/sessions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { env } = createSessionSchema.parse(req.body);
    
    // 1. Ask Docker to start the container
    console.log(`[Orchestrator] Starting container for env: ${env}`);
    const containerId = await startEnvironmentContainer(env);
    
    // 2. Record this in the database
    const sessionId = uuidv4();
    const result = await db.query(
      `INSERT INTO sessions (session_id, env, container_id, status)
       VALUES ($1, $2, $3, 'active')
       RETURNING session_id, env, start_time, status, container_id`,
      [sessionId, env, containerId]
    );
    
    console.log(`[Orchestrator] Session ${sessionId} created with container ${containerId}`);
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('[Orchestrator] Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session', details: error.message });
  }
});

// GET SESSION
router.get('/sessions/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const result = await db.query('SELECT * FROM sessions WHERE session_id = $1', [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// DELETE SESSION
router.delete('/sessions/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // 1. Get container details
    const result = await db.query('SELECT container_id, status FROM sessions WHERE session_id = $1', [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    
    const { container_id, status } = result.rows[0];
    
    // 2. Skip if already expired
    if (status !== 'active') {
      res.status(400).json({ error: 'Session is not active' });
      return;
    }
    
    // 3. Stop internal container
    if (container_id) {
      console.log(`[Orchestrator] Stopping container ${container_id} for session ${id}`);
      await stopAndRemoveContainer(container_id);
    }
    
    // 4. Update database
    const updated = await db.query(
      `UPDATE sessions SET status = 'expired', end_time = NOW() WHERE session_id = $1 RETURNING *`,
      [id]
    );
    
    console.log(`[Orchestrator] Session ${id} terminated`);
    res.json({ message: 'Session terminated successfully', session: updated.rows[0] });
  } catch (error: any) {
    console.error('[Orchestrator] Error terminating session:', error);
    res.status(500).json({ error: 'Failed to terminate session' });
  }
});

export default router;
