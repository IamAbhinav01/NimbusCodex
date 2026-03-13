import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'orchestrator-service' });
});

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`[Orchestrator Service] Running on port ${PORT}`);
});
