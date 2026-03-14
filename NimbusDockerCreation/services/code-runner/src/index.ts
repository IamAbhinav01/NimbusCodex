import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { executeCode } from './executor';

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({
  connectionString: process.env.DATABASE_URL
});

/**
 * POST /execute
 * { sessionId, code, language }
 */
app.post('/execute', async (req: Request, res: Response): Promise<void> => {
  const { sessionId, code, language } = req.body;

  if (!sessionId || !code || !language) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // 1. Fetch containerId from database
    const result = await db.query(
      'SELECT container_id FROM sessions WHERE session_id = $1 AND status = $2',
      [sessionId, 'active']
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Active session not found' });
      return;
    }

    const containerId = result.rows[0].container_id;

    // 2. Execute code
    console.log(`[CodeRunner] Executing ${language} for session ${sessionId}`);
    const result_exec = await executeCode(containerId, code, language);

    // 3. Return results
    res.json(result_exec);
  } catch (error: any) {
    console.error('[CodeRunner] Execution error:', error);
    res.status(500).json({ error: 'Execution failed', details: error.message });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'code-runner-service' });
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`[Code Runner Service] Running on port ${PORT}`);
});
