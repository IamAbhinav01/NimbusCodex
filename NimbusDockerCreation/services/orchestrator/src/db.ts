import { Pool } from 'pg';

export const db = new Pool({
  connectionString: process.env.DATABASE_URL
});

db.on('connect', () => {
  console.log('[Orchestrator] Connected to PostgreSQL');
});

db.on('error', (err: Error) => {
  console.error('[Orchestrator] Unexpected error on idle client', err);
  process.exit(-1);
});
