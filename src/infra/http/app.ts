import 'dotenv/config';
import 'express-async-errors';
import express, { NextFunction, Request, Response } from 'express';
import { routes } from './routes';
import { ZodError } from 'zod';
import typeormServer from '../database/typeorm/setup';

const app = express();

app.use(express.json());

app.use(routes);

typeormServer
  .initialize()
  .then(() => {
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof ZodError) {
        // console.log(err.flatten().fieldErrors);

        res.status(400).json({
          message: 'Erro de validação',
          errors: err.flatten().fieldErrors,
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
  })
  .catch((err) => {
    console.error('Erro durante a inicialização do servidor', err);
  });

export { app };
