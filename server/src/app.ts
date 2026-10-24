import express from 'express';
import { healthRouter } from './routes/health';
import { interrogateRouter } from './routes/interrogate';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/api/health', healthRouter);
  app.use('/api/interrogate', interrogateRouter);

  return app;
}
