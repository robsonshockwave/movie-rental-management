import { IMovieRepository } from '../domain/repositories/IMovieRepository';
import { AppError } from '../shared/errors/AppError';
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

  const movieResponseDTO = {
    name: 'any_name',
    genre: 'any_genre',
    quantity: 1,
    ISAN: 'any_ISAN',
    author: 'any_author',
    id: 'any_id',
  };

  test('should return a movie if isan is registered', async () => {
    movieRepository.findByISANorName.mockResolvedValue(movieResponseDTO);
    const sut = new GetMovieByISANorNameUseCase(movieRepository);

    const movie = await sut.execute({ value: movieResponseDTO.ISAN });

    expect(movie.getRight()).toEqual(movieResponseDTO);
    expect(movieRepository.findByISANorName).toHaveBeenCalledTimes(1);
    expect(movieRepository.findByISANorName).toHaveBeenCalledWith(
      movieResponseDTO.ISAN
    );
  });

  test('should return null if isan is not registered', async () => {
    movieRepository.findByISANorName.mockResolvedValue([]);
    const sut = new GetMovieByISANorNameUseCase(movieRepository);

    const movie = await sut.execute({ value: movieResponseDTO.ISAN });

    expect(movie.getRight()).toEqual([]);
    expect(movieRepository.findByISANorName).toHaveBeenCalledTimes(1);
    expect(movieRepository.findByISANorName).toHaveBeenCalledWith(
      movieResponseDTO.ISAN
    );
  });

  test('should return error if repository is not provided', async () => {
    const sut = new GetMovieByISANorNameUseCase(undefined as any);

    await expect(sut.execute({ value: movieResponseDTO.ISAN })).rejects.toThrow(
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
