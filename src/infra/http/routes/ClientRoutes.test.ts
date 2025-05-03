import request from 'supertest';
import { app } from '../app';
import { typeormServer } from '../../database/typeorm/setup';
import { ClientTypeorm } from '../../database/typeorm/entities/Client';

describe('ClientRoutes', () => {
  beforeEach(async () => {
    await typeormServer
      .getRepository(ClientTypeorm)
      .query('DELETE FROM clients');
  });

  test('should be possible to register a client', async () => {
    const { statusCode, body } = await request(app).post('/clients').send({
      name: 'any_name',
      cpf: '123.123.123-12',
      phone: '33333333',
      email: 'any_email@email.com',
      address: 'any_address',
    });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });

  test('should be possible to find a client by cpf', async () => {
    const clientDTO = {
      name: 'any_name',
      cpf: '123.123.123-12',
      phone: '33333333',
      email: 'any_email@email.com',
      address: 'any_address',
    };

    await typeormServer.getRepository(ClientTypeorm).save(clientDTO);

    const { statusCode, body } = await request(app).get(
      '/clients/cpf/123.123.123-12'
    );

    expect(body.id).toBeDefined();
    expect(statusCode).toBe(200);
    expect(body).toEqual(expect.objectContaining(clientDTO));
  });
});
