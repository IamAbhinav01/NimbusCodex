import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => console.log('[Redis] Connected'));
redis.on('error', (err) => console.error('[Redis] Error:', err.message));

const SESSION_TTL = 10 * 60; // 10 minutes in seconds

/**
 * Register a session in Redis with a 10-minute TTL.
 */
export async function setSessionTTL(sessionId: string, containerId: string): Promise<void> {
  await redis.set(`session:${sessionId}`, containerId, 'EX', SESSION_TTL);
  console.log(`[Redis] session:${sessionId} registered with TTL ${SESSION_TTL}s`);
}

/**
 * Remove a session key from Redis (called on manual or auto expiry).
 */
export async function deleteSessionKey(sessionId: string): Promise<void> {
  await redis.del(`session:${sessionId}`);
  console.log(`[Redis] session:${sessionId} key deleted`);
}
