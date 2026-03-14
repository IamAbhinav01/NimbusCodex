import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { requireAuth } from './auth';

const app = express();
const PORT = process.env.PORT || 4000;

const AUTH_URL = process.env.AUTH_URL || 'http://localhost:4001';
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://localhost:4002';
const CODE_RUNNER_URL = process.env.CODE_RUNNER_URL || 'http://localhost:4003';

app.use(cors());

// Request Logging
app.use((req, res, next) => {
  console.log(`[Gateway Logger] ${req.method} ${req.originalUrl} -> ${req.url}`);
  next();
});

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// AUTH
// Map /api/auth/* to auth:4001/*
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: AUTH_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth': '',
    },
  })
);

// SESSIONS
// Map /api/sessions/* to orchestrator:4002/sessions/*
// Since we mount at /api/sessions, visiting /api/sessions/123 passes /123 to proxy.
// Appending /sessions to target handles the prefix on the target side.
app.use(
  '/api/sessions',
  requireAuth,
  createProxyMiddleware({
    target: ORCHESTRATOR_URL + '/sessions',
    changeOrigin: true,
  })
);

// CODE EXECUTION
// Map /api/execute to code-runner:4003/execute
app.use(
  '/api/execute',
  requireAuth,
  createProxyMiddleware({
    target: CODE_RUNNER_URL + '/execute',
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`[API Gateway] Running on port ${PORT}`);
});
