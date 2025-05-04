import { Router } from 'express';
import { loginCompose } from './composers/LoginCompose';

const loginRoutes = Router();

loginRoutes.post('/', async (req, res) => {
  const httpRequest = { body: req.body };

  const { statusCode, body } = await loginCompose(httpRequest);

  res.status(statusCode).json(body);
});

export { loginRoutes };
