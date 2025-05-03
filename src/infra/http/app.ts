import express, { NextFunction, Request, Response } from 'express';
import { routes } from './routes';
import { ZodError } from 'zod';

const app = express();

app.use(express.json());

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Erro de validação',
      errors: err,
    });
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(500).json({
    error: 'error',
    message: 'Internal server error',
  });
});

export { app };
