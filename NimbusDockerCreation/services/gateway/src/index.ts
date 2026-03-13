import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { requireAuth } from './auth';

const app = express();
const PORT = process.env.PORT || 4000;

const AUTH_URL = process.env.AUTH_URL || 'http://localhost:4001';
const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://localhost:4002';

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
      '^/': '/sessions', // Correctly rewrite the relative path stripped by express
    },
  })
);

app.listen(PORT, () => {
  console.log(`[API Gateway] Running on port ${PORT}`);
});
