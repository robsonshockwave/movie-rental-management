import request from 'supertest';
import { MovieTypeorm } from '../../database/typeorm/entities/Movie';
import typeormServer from '../../database/typeorm/setup';
import { app } from '../app';
import { HireTypeorm } from '../../database/typeorm/entities/Hire';

describe('MovieRoutes', () => {
  beforeEach(async () => {
    await typeormServer.getRepository(HireTypeorm).query('DELETE FROM hires');
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

  test('should be possible to find a movie by ISAN', async () => {
    const movieDTO = {
      name: 'any_name',
      genre: 'any_genre',
      quantity: 1,
      ISAN: '1234567890123456',
      author: 'any_author',
    };

    await typeormServer.getRepository(MovieTypeorm).save(movieDTO);

    const { statusCode, body } = await request(app)
      .get('/movies')
      .query({ value: '1234567890123456' });

    expect(body[0].id).toBeDefined();
    expect(statusCode).toBe(200);
    expect(body[0]).toEqual(expect.objectContaining(movieDTO));
  });

  test('should be possible to find a movie by name', async () => {
    const movieDTO = {
      name: 'any_name',
      genre: 'any_genre',
      quantity: 1,
      ISAN: '1234567890123456',
      author: 'any_author',
    };

    await typeormServer.getRepository(MovieTypeorm).save(movieDTO);

    const { statusCode, body } = await request(app)
      .get('/movies')
      .query({ value: 'any_name' });

    expect(body[0].id).toBeDefined();
    expect(statusCode).toBe(200);
    expect(body[0]).toEqual(expect.objectContaining(movieDTO));
  });

  test('should check if the value was passed correctly to query', async () => {
    const { statusCode, body } = await request(app)
      .get('/movies')
      .query({ value: '' });

    expect(statusCode).toBe(400);
    expect(body.message).toBe('Erro de validação');
    expect(body.errors).toEqual({
      value: ['value must be at least 1 characters long'],
    });
  });
});
