import request from 'supertest';
import { app } from '../app';
import typeormServer from '../../database/typeorm/setup';
import { ClientTypeorm } from '../../database/typeorm/entities/Client';
import { HireTypeorm } from '../../database/typeorm/entities/Hire';
import { createUserAndReturnToken } from '../../../shared/utils/tests/authenticate';
import { UserTypeorm } from '../../database/typeorm/entities/User';

describe('ClientRoutes', () => {
  beforeEach(async () => {
    await typeormServer.getRepository(HireTypeorm).query('DELETE FROM hires');
    await typeormServer
      .getRepository(ClientTypeorm)
      .query('DELETE FROM clients');
  });

  let token: string;

  beforeAll(async () => {
    await typeormServer.getRepository(UserTypeorm).query('DELETE FROM users');
    token = await createUserAndReturnToken();
  });

  test('should be possible to register a client', async () => {
    const { statusCode, body } = await request(app)
      .post('/clients')
      .send({
        name: 'any_name',
        cpf: '123.123.123-12',
        phone: '33333333',
        email: 'any_email@email.com',
        address: 'any_address',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });

  test('should return an error with missing required fields', async () => {
    const { statusCode, body } = await request(app)
      .post('/clients')
      .send({})
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro de validação');
    expect(body.errors).toEqual({
      name: ['name is required'],
      address: ['address is required'],
      cpf: ['cpf is required'],
      email: ['email is required'],
      phone: ['phone is required'],
    });
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

    const { statusCode, body } = await request(app)
      .get('/clients/cpf/123.123.123-12')
      .set('Authorization', `Bearer ${token}`);

    expect(body.id).toBeDefined();
    expect(statusCode).toBe(200);
    expect(body).toEqual(expect.objectContaining(clientDTO));
  });

  test('should check if the cpf was passed correctly to params', async () => {
    const { statusCode, body } = await request(app)
      .get('/clients/cpf/1')
      .set('Authorization', `Bearer ${token}`);

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro de validação');
    expect(body.errors).toEqual({
      cpf: ['invalid cpf'],
    });
  });
});
