import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { startEnvironmentContainer, stopAndRemoveContainer, getContainerStats } from './docker';
import { setSessionTTL, deleteSessionKey } from './redis';
import { registry, sessionActiveTotal, sessionCreatedTotal, sessionExpiredTotal } from './metrics';

const router = Router();

const createSessionSchema = z.object({
  env: z.enum(['python-basic', 'node-ts', 'node-fullstack', 'cpp', 'java', 'python-ds', 'python-ml'])
});

import { getResourceLimits } from './resourceConfig';

// CREATE SESSION
router.post('/sessions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { env } = createSessionSchema.parse(req.body);
    const limits = getResourceLimits(env);
    
    // 1. Ask Docker to start the container
    console.log(`[Orchestrator] Starting container for env: ${env} with limits: ${JSON.stringify(limits)}`);
    const containerId = await startEnvironmentContainer(env);
    
    // 2. Record this in the database (end_time set to NOW() + 15m)
    const sessionId = uuidv4();
    const result = await db.query(
      `INSERT INTO sessions (session_id, env, container_id, status, duration_minutes, end_time)
       VALUES ($1, $2, $3, 'active', 10, NOW() + INTERVAL '10 minutes')
       RETURNING session_id, env, start_time, end_time, status, container_id, duration_minutes`,
      [sessionId, env, containerId]
    );

    const session = result.rows[0];
    
    // 3. Register in Redis with 15-minute TTL
    await setSessionTTL(sessionId, containerId).catch((err) =>
      console.warn('[Orchestrator] Redis setSessionTTL failed (non-fatal):', err.message)
    );
    
    // 4. Track metrics
    sessionCreatedTotal.inc({ env });
    sessionActiveTotal.inc();
    
    console.log(`[Orchestrator] Session ${sessionId} created with container ${containerId}`);
    res.status(201).json({
      ...session,
      cpu_limit: limits.nanoCpus / 1e9,
      memory_limit: limits.memory / (1024 * 1024)
    });
  } catch (error: any) {
    console.error('[Orchestrator] Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session', details: error.message });
  }
});

// GET SESSION STATS
router.get('/sessions/:id/stats', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT container_id, status FROM sessions WHERE session_id = $1', [id]);

    if (result.rows.length === 0 || result.rows[0].status !== 'active') {
      res.status(404).json({ error: 'Active session not found' });
      return;
    }

    const stats = await getContainerStats(result.rows[0].container_id);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch container stats' });
  }
});

// GET SESSION
router.get('/sessions/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`[Orchestrator] GET /sessions/${id} received`);
    
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
    console.log(`[Orchestrator] DELETE /sessions/${id} received`);
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

    // 5. Remove Redis TTL key
    await deleteSessionKey(id).catch(() => {/* non-fatal */});

    // 6. Track metrics
    sessionActiveTotal.dec();
    sessionExpiredTotal.inc({ reason: 'manual' });

    console.log(`[Orchestrator] Session ${id} terminated`);
    res.json({ message: 'Session terminated successfully', session: updated.rows[0] });
  } catch (error: any) {
    console.error('[Orchestrator] Error terminating session:', error);
    res.status(500).json({ error: 'Failed to terminate session' });
  }
});

// Catch-all for unmatched routes in this router
router.use((req, res) => {
  console.warn(`[Orchestrator] 404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not Found in Orchestrator' });
});

export default router;
