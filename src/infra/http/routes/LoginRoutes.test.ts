import { UserTypeorm } from '../../database/typeorm/entities/User';
import typeormServer from '../../database/typeorm/setup';
import request from 'supertest';
import { app } from '../app';
import { HashService } from '../../../shared/services/HashService';

describe('LoginRoutes', () => {
  beforeEach(async () => {
    await typeormServer.getRepository(UserTypeorm).query('DELETE FROM users');
  });

  test('should be possible to login', async () => {
    const hashService = new HashService();
    await typeormServer.getRepository(UserTypeorm).save({
      firstName: 'any_firstName',
      lastName: 'any_lastName',
      email: 'any_email@email.com',
      password: await hashService.hashService('any_password'),
    });

    const { statusCode, body } = await request(app).post('/login').send({
      email: 'any_email@email.com',
      password: 'any_password',
    });

    expect(statusCode).toBe(200);
    expect(body).toEqual({
      user: {
        id: expect.any(String),
        firstName: 'any_firstName',
        lastName: 'any_lastName',
        email: 'any_email@email.com',
      },
      token: expect.any(String),
    });
  });

  test('should not be possible to login', async () => {
    const { statusCode, body } = await request(app).post('/login').send({
      email: 'any_email@email.com',
      password: 'any_password',
    });

    expect(statusCode).toBe(400);
    expect(body.message).toEqual('Email ou senha inválidos');
  });

  test('should return an error with missing required fields', async () => {
    const { statusCode, body } = await request(app).post('/login').send({});

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro de validação');
    expect(body.errors).toEqual({
      email: ['email is required'],
      password: ['password is required'],
    });
  });
});
