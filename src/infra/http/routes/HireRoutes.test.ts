import { ClientTypeorm } from '../../database/typeorm/entities/Client';
import { HireTypeorm } from '../../database/typeorm/entities/Hire';
import { MovieTypeorm } from '../../database/typeorm/entities/Movie';
import { typeormServer } from '../../database/typeorm/setup';
import request from 'supertest';
import { app } from '../app';

describe('HireRoutes', () => {
  beforeEach(async () => {
    await typeormServer.getRepository(HireTypeorm).query('DELETE FROM hires');
    await typeormServer.getRepository(MovieTypeorm).query('DELETE FROM movies');
    await typeormServer
      .getRepository(ClientTypeorm)
      .query('DELETE FROM clients');
  });

  test('should be possible to register a hire', async () => {
    const clientDTO = {
      name: 'any_name',
      cpf: '123.123.123-12',
      phone: '33333333',
      email: 'any_email@email.com',
      address: 'any_address',
    };

    const movieDTO = {
      name: 'any_name',
      author: 'any_author',
      genre: 'any_genre',
      ISAN: '1234567890123456',
      quantity: 1,
    };

    const client = await typeormServer
      .getRepository(ClientTypeorm)
      .save(clientDTO);
    const movie = await typeormServer
      .getRepository(MovieTypeorm)
      .save(movieDTO);

    const { statusCode, body } = await request(app)
      .post('/hires')
      .send({
        movie_id: movie.id,
        client_id: client.id,
        requested_date: new Date('2025-01-01').toISOString(),
        delivery_date: new Date('2025-01-04').toISOString(),
      });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });

  test('should return an error with missing required fields', async () => {
    const { statusCode, body } = await request(app).post('/hires').send({});

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro de validação');
    expect(body.errors).toEqual({
      movie_id: ['movie_id is required'],
      client_id: ['client_id is required'],
      requested_date: ['requested_date is required'],
      delivery_date: ['delivery_date is required'],
    });
  });
});
