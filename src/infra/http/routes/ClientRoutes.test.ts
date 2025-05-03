import request from 'supertest';
import { app } from '../app';

describe('ClientRoutes', () => {
  test('should be possible to register a client', async () => {
    const { statusCode, body } = await request(app).post('/client').send({
      name: 'any_name',
      cpf: '123.123.123-12',
      phone: '33333333',
      email: 'any_email@email.com',
      address: 'any_address',
    });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });
});
