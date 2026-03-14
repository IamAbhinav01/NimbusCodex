import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { redis } from './redis';
import { startExpiryScheduler } from './scheduler';
import { registry } from './metrics';

const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[Orchestrator Logger] ${req.method} ${req.url}`);
  next();
});

app.get('/metrics', async (req: Request, res: Response) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

app.use('/', routes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'orchestrator-service' });
});

const PORT = process.env.PORT || 4002;

app.listen(PORT, async () => {
  console.log(`[Orchestrator Service] Running on port ${PORT}`);
  // Connect to Redis
  await redis.connect().catch((err: any) =>
    console.warn('[Orchestrator] Redis connection failed (non-fatal):', err.message)
  );
  // Start background expiry cron
  startExpiryScheduler();
});
