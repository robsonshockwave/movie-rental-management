import { MovieTypeorm } from '../entities/Movie';
import { typeormServer } from '../setup';
import { MovieRepository } from './MovieRepository';

describe('MovieRepository', () => {
  const movieRepository = typeormServer.getRepository(MovieTypeorm);
  const sut = new MovieRepository();

  beforeEach(async () => {
    await movieRepository.delete({});
  });

  const movieDTO = {
    name: 'any_name',
    genre: 'any_genre',
    quantity: 1,
    ISAN: 'any_ISAN',
    author: 'any_author',
  };

  test('should create a movie', async () => {
    const movie = await sut.create(movieDTO);

    expect(movie).toEqual({
      id: expect.any(String),
      ...movieDTO,
    });
  });

  test('should find a movie by ISAN', async () => {
    await movieRepository.save(movieDTO);

    const movie = await sut.findByISAN('any_ISAN');

    expect(movie).toEqual({
      id: expect.any(String),
      ...movieDTO,
    });
  });

  test('should dont find a movie by ISAN', async () => {
    const movie = await sut.findByISAN('any_ISAN');

    expect(movie).toBeNull();
  });

  test('should find a movie by name or ISAN', async () => {
    await movieRepository.save(movieDTO);

    const movie = await sut.findByISANorName('any_name');

    expect(movie).toEqual([
      {
        id: expect.any(String),
        ...movieDTO,
      },
    ]);
  });
});
