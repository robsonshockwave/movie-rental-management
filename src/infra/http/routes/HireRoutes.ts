import { Router } from 'express';
import { createHireCompose } from './composers/CreateHireCompose';
import { IHttpRequestCreateHire } from '../dtos/HireHttpDTO';
import { getPendingHiresCompose } from './composers/GetPendingHiresCompose';

const hireRoutes = Router();

hireRoutes.post('/', async (req, res) => {
  const httpRequest = { body: req.body };

  const { statusCode, body } = await createHireCompose(
    httpRequest as IHttpRequestCreateHire
  );

  res.status(statusCode).json(body);
});

hireRoutes.get('/', async (req, res) => {
  const { statusCode, body } = await getPendingHiresCompose();

  res.status(statusCode).json(body);
});

export { hireRoutes };
