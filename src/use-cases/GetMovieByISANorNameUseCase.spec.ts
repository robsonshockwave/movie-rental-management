import { IMovieRepository } from '../domain/repositories/IMovieRepository';
import { AppError } from '../shared/utils/AppError';
import { GetMovieByISANorNameDTO } from './GetMovieByISANorNameDTO';
import { GetMovieByISANorNameUseCase } from './GetMovieByISANorNameUseCase';

describe('CreateMovieUseCase', () => {
  let movieRepository: jest.Mocked<IMovieRepository>;

  beforeEach(() => {
    movieRepository = {
      create: jest.fn(),
      findByISAN: jest.fn(),
      findByISANorName: jest.fn(),
    };
  });

  const movieDTO = {
    name: 'any_name',
    genre: 'any_genre',
    quantity: 1,
    ISAN: 'any_ISAN',
    author: 'any_author',
  };

  test('should return a movie if isan is registered', async () => {
    movieRepository.findByISANorName.mockResolvedValue(movieDTO);
    const sut = new GetMovieByISANorNameUseCase(movieRepository);

    const movie = await sut.execute({ value: movieDTO.ISAN });

    expect(movie.getRight()).toEqual(movieDTO);
    expect(movieRepository.findByISANorName).toHaveBeenCalledTimes(1);
    expect(movieRepository.findByISANorName).toHaveBeenCalledWith(
      movieDTO.ISAN
    );
  });

  test('should return null if isan is not registered', async () => {
    movieRepository.findByISANorName.mockResolvedValue([]);
    const sut = new GetMovieByISANorNameUseCase(movieRepository);

    const movie = await sut.execute({ value: movieDTO.ISAN });

    expect(movie.getRight()).toEqual([]);
    expect(movieRepository.findByISANorName).toHaveBeenCalledTimes(1);
    expect(movieRepository.findByISANorName).toHaveBeenCalledWith(
      movieDTO.ISAN
    );
  });

  test('should return error if repository is not provided', async () => {
    const sut = new GetMovieByISANorNameUseCase(undefined as any);

    await expect(sut.execute({ value: movieDTO.ISAN })).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return error if mandatory parameters are not provided', async () => {
    const sut = new GetMovieByISANorNameUseCase(movieRepository);

    await expect(sut.execute({} as GetMovieByISANorNameDTO)).rejects.toThrow(
      new AppError(AppError.missingMandatoryParameters)
    );
  });
});
