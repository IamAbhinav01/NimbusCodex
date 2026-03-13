import { Pool } from 'pg';
// Expecting DATABASE_URL from .env or docker-compose environment vars
if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL environment variable is not set');
  process.exit(1);
}

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.on('connect', () => {
  console.log('[Auth Service] Connected to PostgreSQL');
});

db.on('error', (err: Error) => {
  console.error('[Auth Service] Unexpected error on idle client', err);
  process.exit(-1);
});
