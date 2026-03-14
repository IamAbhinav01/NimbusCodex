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

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// AUTH
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
app.use(
  '/api/sessions',
  requireAuth,
  createProxyMiddleware({
    target: ORCHESTRATOR_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/sessions',
    },
  })
);

// CODE EXECUTION
app.use(
  '/api/execute',
  requireAuth,
  createProxyMiddleware({
    target: CODE_RUNNER_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/execute',
    },
  })
);

app.listen(PORT, () => {
  console.log(`[API Gateway] Running on port ${PORT}`);
});
