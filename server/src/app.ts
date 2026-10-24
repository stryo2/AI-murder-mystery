import express from 'express';
import { charactersRouter } from './routes/characters';
import { healthRouter } from './routes/health';
import { interrogateRouter } from './routes/interrogate';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/api/health', healthRouter);
  app.use('/api/characters', charactersRouter);
  app.use('/api/interrogate', interrogateRouter);

  return app;
}
