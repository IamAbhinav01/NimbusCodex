import { Registry, Counter, Gauge, Histogram } from 'prom-client';

export const registry = new Registry();

// Active sessions gauge
export const sessionActiveTotal = new Gauge({
  name: 'session_active_total',
  help: 'Total number of active lab sessions',
  registers: [registry]
});

// Created sessions counter
export const sessionCreatedTotal = new Counter({
  name: 'session_created_total',
  help: 'Total number of sessions created',
  labelNames: ['env'],
  registers: [registry]
});

// Expired sessions counter
export const sessionExpiredTotal = new Counter({
  name: 'session_expired_total',
  help: 'Total number of sessions expired',
  labelNames: ['reason'], // reason: 'timeout' or 'manual'
  registers: [registry]
});

// Session duration histogram
export const sessionDurationSeconds = new Histogram({
  name: 'session_duration_seconds',
  help: 'Session duration in seconds',
  labelNames: ['env'],
  buckets: [60, 300, 600, 900, 1800, 3600],
  registers: [registry]
});
