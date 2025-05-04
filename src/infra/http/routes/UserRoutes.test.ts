import { UserTypeorm } from '../../database/typeorm/entities/User';
import typeormServer from '../../database/typeorm/setup';
import request from 'supertest';
import { app } from '../app';

describe('UserRoutes', () => {
  beforeEach(async () => {
    await typeormServer.getRepository(UserTypeorm).query('DELETE FROM users');
  });

  test('should create a user', async () => {
    const { statusCode, body } = await request(app).post('/users').send({
      firstName: 'any_firstName',
      lastName: 'any_lastName',
      email: 'any_email@email.com',
      password: 'any_password',
    });

    const responseDTO = {
      user: {
        id: expect.any(String),
        firstName: 'any_firstName',
        lastName: 'any_lastName',
        email: 'any_email@email.com',
        password: expect.any(String),
      },
      token: expect.any(String),
    };

    expect(statusCode).toBe(201);
    expect(body).toEqual(responseDTO);
  });

  test('should return an error with missing required fields', async () => {
    const { statusCode, body } = await request(app).post('/users').send({});

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro de validação');
    expect(body.errors).toEqual({
      firstName: ['firstName is required'],
      lastName: ['lastName is required'],
      email: ['email is required'],
      password: ['password is required'],
    });
  });
});
