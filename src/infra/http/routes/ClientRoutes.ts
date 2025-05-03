import { Router, Request, Response } from 'express';
import { createClientCompose } from './composers/CreateClientCompose';

const clientRoutes = Router();

clientRoutes.post('/', async (req: Request, res: Response): Promise<void> => {
  const httpRequest = req.body;

  const { statusCode, body } = await createClientCompose(httpRequest);

  res.status(statusCode).json(body);
});

export { clientRoutes };
