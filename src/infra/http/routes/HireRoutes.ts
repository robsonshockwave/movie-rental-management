import { Router } from 'express';
import { createHireCompose } from './composers/CreateHireCompose';
import { IHttpRequestCreateHire } from '../dtos/HireHttpDTO';

const hireRoutes = Router();

hireRoutes.post('/', async (req, res) => {
  const httpRequest = { body: req.body };

  const { statusCode, body } = await createHireCompose(
    httpRequest as IHttpRequestCreateHire
  );

  res.status(statusCode).json(body);
});

export { hireRoutes };
