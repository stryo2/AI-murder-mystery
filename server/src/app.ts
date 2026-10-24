import express from 'express';
import { accusationRouter } from './routes/accusation';
import { caseRouter } from './routes/case';
import { charactersRouter } from './routes/characters';
import { healthRouter } from './routes/health';
import { interrogateRouter } from './routes/interrogate';
import { notebookRouter } from './routes/notebook';
import { sceneRouter } from './routes/scene';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/api/health', healthRouter);
  app.use('/api/accusation', accusationRouter);
  app.use('/api/case', caseRouter);
  app.use('/api/characters', charactersRouter);
  app.use('/api/interrogate', interrogateRouter);
  app.use('/api/notebook', notebookRouter);
  app.use('/api/scene', sceneRouter);

  return app;
}
