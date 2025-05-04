import { Router } from 'express';
import { createHireCompose } from './composers/CreateHireCompose';
import {
  IHttpRequestCreateHire,
  IHttpRequestReturnMovie,
} from '../dtos/HireHttpDTO';
import { getPendingHiresCompose } from './composers/GetPendingHiresCompose';
import { returnMovieCompose } from './composers/ReturnMovieCompose';

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

hireRoutes.put('/return/:hire_id', async (req, res) => {
  const httpRequest = { params: req.params, body: req.body };

  const { statusCode, body } = await returnMovieCompose(
    httpRequest as IHttpRequestReturnMovie
  );

  res.status(statusCode).json(body);
});

export { hireRoutes };
