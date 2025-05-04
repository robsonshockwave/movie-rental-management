import { Router } from 'express';
import { createUserCompose } from './composers/CreateUserCompose';
import { IHttpRequestCreateUser } from '../dtos/UserHttpDTO';

const userRoutes = Router();

userRoutes.post('/', async (req, res) => {
  const httpRequest = { body: req.body };

  const { statusCode, body } = await createUserCompose(
    httpRequest as IHttpRequestCreateUser
  );

  res.status(statusCode).json(body);
});

export { userRoutes };
