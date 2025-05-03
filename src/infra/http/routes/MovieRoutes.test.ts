import request from 'supertest';
import { MovieTypeorm } from '../../database/typeorm/entities/Movie';
import { typeormServer } from '../../database/typeorm/setup';
import { app } from '../app';

describe('MovieRoutes', () => {
  beforeEach(async () => {
    await typeormServer.getRepository(MovieTypeorm).query('DELETE FROM movies');
  });

  test('should be possible to register a movie', async () => {
    const { statusCode, body } = await request(app).post('/movies').send({
      name: 'any_name',
      genre: 'any_genre',
      quantity: 1,
      ISAN: '1234567890123456',
      author: 'any_author',
    });

    expect(statusCode).toBe(201);
    expect(body).toBeNull();
  });

  test('should return an error with missing required fields', async () => {
    const { statusCode, body } = await request(app).post('/movies').send({});

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro de validação');
    expect(body.errors).toEqual({
      name: ['name is required'],
      genre: ['genre is required'],
      quantity: ['quantity is required'],
      ISAN: ['ISAN is required'],
      author: ['author is required'],
    });
  });
});
