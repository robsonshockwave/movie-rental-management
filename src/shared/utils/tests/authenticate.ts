import request from 'supertest';
import { app } from '../../../infra/http/app';

export const createUserAndReturnToken = async () => {
  const { body } = await request(app)
    .post('/users')
    .send({
      email: `user+${Date.now()}@email.com`,
      password: '12345',
      firstName: 'any_firstName',
      lastName: 'any_lastName',
    });

  return body.token;
};
