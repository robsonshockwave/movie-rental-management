import { IHireRepository } from '../domain/repositories/IHireRepository';
import { AppError } from '../shared/errors/AppError';
import { ReturnMovieDTO } from './ReturnMovieDTO';
import { ReturnMovieUseCase } from './ReturnMovieUseCase';

describe('ReturnMovieUseCase', () => {
  let hireRepository: jest.Mocked<IHireRepository>;

  beforeEach(() => {
    hireRepository = {
      create: jest.fn(),
      thisMovieHiredByClient: jest.fn(),
      getHireWithClientAndMovieById: jest.fn(),
      getPendingHires: jest.fn(),
      returnMovie: jest.fn(),
    };
  });

  const hireResponseDTO = {
    client_id: 'any_client_id',
    delivery_date: '2025-01-01',
    id: 'any_id',
    movie_id: 'any_movie_id',
    requested_date: '2025-01-01',
    return_date: null,
    client: {
      address: 'any_address',
      cpf: 'any_cpf',
      email: 'any_email',
      id: 'any_id',
      name: 'any_name',
      phone: 'any_phone',
    },
    movie: {
      author: 'any_author',
      genre: 'any_genre',
      id: 'any_id',
      ISAN: 'any_ISAN',
      name: 'any_name',
      quantity: 1,
    },
  };

  test('should return a movie within the deadline', async () => {
    hireRepository.returnMovie.mockResolvedValue(hireResponseDTO);

    const sut = new ReturnMovieUseCase(hireRepository);

    const output = await sut.execute({
      hire_id: 'any_id',
      return_date: new Date('2025-01-01'),
    });

    expect(output.getRight()).toEqual('Multa por atraso: R$ 0,00');
    expect(hireRepository.returnMovie).toHaveBeenCalledTimes(1);
    expect(hireRepository.returnMovie).toHaveBeenCalledWith(
      'any_id',
      new Date('2025-01-01').toISOString()
    );
  });

  test('should return a movie out of date', async () => {
    hireRepository.returnMovie.mockResolvedValue(hireResponseDTO);

    const sut = new ReturnMovieUseCase(hireRepository);

    const output = await sut.execute({
      hire_id: 'any_id',
      return_date: new Date('2025-01-03'),
    });

    expect(output.getRight()).toEqual('Multa por atraso: R$ 10,00');
    expect(hireRepository.returnMovie).toHaveBeenCalledTimes(1);
    expect(hireRepository.returnMovie).toHaveBeenCalledWith(
      'any_id',
      new Date('2025-01-03').toISOString()
    );
  });

  test('should return error if repository is not provided', async () => {
    const sut = new ReturnMovieUseCase(undefined as any);

    await expect(
      sut.execute({ hire_id: 'any_id', return_date: new Date('2025-01-01') })
    ).rejects.toThrow(new AppError(AppError.dependencies));
  });

  test('should return error if mandatory parameters are not provided', async () => {
    const sut = new ReturnMovieUseCase(hireRepository);

    await expect(sut.execute({} as ReturnMovieDTO)).rejects.toThrow(
      new AppError(AppError.missingMandatoryParameters)
    );
  });
});
