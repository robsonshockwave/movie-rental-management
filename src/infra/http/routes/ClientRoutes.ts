import { Router, Request, Response } from 'express';
import { createClientCompose } from './composers/CreateClientCompose';
import { getClientByCpfCompose } from './composers/GetClientByCpfCompose';
import {
  IHttpRequestCreateClient,
  IHttpRequestGetClientByCpf,
} from '../dtos/ClientHttpDTO';

const clientRoutes = Router();

clientRoutes.post('/', async (req: Request, res: Response) => {
  const httpRequest = { body: req.body };

  const { statusCode, body } = await createClientCompose(
    httpRequest as IHttpRequestCreateClient
  );

  res.status(statusCode).json(body);
});

clientRoutes.get('/cpf/:cpf', async (req: Request, res: Response) => {
  const httpRequest = { params: req.params };

  const { statusCode, body } = await getClientByCpfCompose(
    httpRequest as IHttpRequestGetClientByCpf
  );

  res.status(statusCode).json(body);
});

export { clientRoutes };
