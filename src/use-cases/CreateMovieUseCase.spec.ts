import { IMovieRepository } from '../domain/repositories/IMovieRepository';
import { AppError } from '../shared/utils/AppError';
import { Either } from '../shared/utils/Either';
import { CreateMovieDTO } from './CreateMovieDTO';
import { CreateMovieUseCase } from './CreateMovieUseCase';

describe('CreateMovieUseCase', () => {
  let movieRepository: jest.Mocked<IMovieRepository>;

  beforeEach(() => {
    movieRepository = {
      create: jest.fn(),
      findByISAN: jest.fn(),
      findByISANorName: jest.fn(),
    };
  });

  const movieResquestDTO = {
    name: 'any_name',
    genre: 'any_genre',
    quantity: 1,
    ISAN: 'any_ISAN',
    author: 'any_author',
  };

  const movieResponseDTO = {
    ...movieResquestDTO,
    id: 'any_id',
  };

  test('should create a movie', async () => {
    const sut = new CreateMovieUseCase(movieRepository);

    const movie = await sut.execute(movieResquestDTO);

    expect(movie.getRight()).toBeNull();
    expect(movieRepository.create).toHaveBeenCalledTimes(1);
    expect(movieRepository.create).toHaveBeenCalledWith(movieResquestDTO);
  });

  test('should return error if repository is not provided', async () => {
    const sut = new CreateMovieUseCase(undefined as any);

    await expect(sut.execute(movieResquestDTO)).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return error if movie already exists by ISAN', async () => {
    movieRepository.findByISAN.mockResolvedValue(movieResponseDTO);

    const sut = new CreateMovieUseCase(movieRepository);

    const movie = await sut.execute(movieResquestDTO);

    expect(movie.getRight()).toBeNull();
    expect(movie.getLeft()).toEqual(
      Either.valueAlreadyRegistered(movieResquestDTO.ISAN)
    );
    expect(movieRepository.findByISAN).toHaveBeenCalledTimes(1);
    expect(movieRepository.findByISAN).toHaveBeenCalledWith(
      movieResquestDTO.ISAN
    );
  });

  test('should return error if mandatory parameters are not provided', async () => {
    const sut = new CreateMovieUseCase(movieRepository);

    await expect(sut.execute({} as CreateMovieDTO)).rejects.toThrow(
      new AppError(AppError.missingMandatoryParameters)
    );
  });
});
