import cron from 'node-cron';
import { db } from './db';
import { stopAndRemoveContainer } from './docker';
import { deleteSessionKey } from './redis';

/**
 * Background cron job that runs every 60 seconds.
 * Finds all sessions that have passed their end_time and are still 'active'.
 * Stops the Docker container, marks the session 'expired', and cleans up Redis.
 */
export function startExpiryScheduler(): void {
  cron.schedule('* * * * *', async () => {
    try {
      const result = await db.query(
        `SELECT session_id, container_id
         FROM sessions
         WHERE status = 'active' AND end_time < NOW()`
      );

      if (result.rows.length === 0) return;

      console.log(`[Scheduler] Found ${result.rows.length} expired session(s) to clean up.`);

      for (const row of result.rows) {
        const { session_id, container_id } = row;
        try {
          if (container_id) {
            await stopAndRemoveContainer(container_id);
          }
          await db.query(
            `UPDATE sessions SET status = 'expired', end_time = NOW()
             WHERE session_id = $1`,
            [session_id]
          );
          await deleteSessionKey(session_id);
          console.log(`[Scheduler] Session ${session_id} expired and cleaned up.`);
        } catch (err: any) {
          console.error(`[Scheduler] Failed to clean up session ${session_id}:`, err.message);
        }
      }
    } catch (err: any) {
      console.error('[Scheduler] Cron error:', err.message);
    }
  });

  console.log('[Scheduler] Expiry cron started (runs every 60s).');
}
