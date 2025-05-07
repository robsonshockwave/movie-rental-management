import 'dotenv/config';
import 'express-async-errors';
import express, { NextFunction, Request, Response } from 'express';
import { routes } from './routes';
import { ZodError } from 'zod';
import typeormServer from '../database/typeorm/setup';

import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { sendMailQueue } from './queue';

const app = express();

app.use(express.json());

app.use(routes);

// QUEUE MONITOR
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queues');
createBullBoard({
  queues: [new BullAdapter(sendMailQueue)],
  serverAdapter,
});

typeormServer
  .initialize()
  .then(() => {
    app.use('/queues', serverAdapter.getRouter());

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
