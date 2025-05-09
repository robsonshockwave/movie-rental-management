import { IHireRepository } from '../domain/repositories/IHireRepository';
import { AppError } from '../shared/errors/AppError';
import { Either } from '../shared/utils/Either';
import { CreateHireDTO } from './CreateHireDTO';
import { CreateHireUseCase } from './CreateHireUseCase';

describe('CreateHireUseCase', () => {
  let hireRepository: jest.Mocked<IHireRepository>;
  // const emailService = {
  //   sendMail: jest.fn(),
  // };

  beforeEach(() => {
    hireRepository = {
      create: jest.fn(),
      thisMovieHiredByClient: jest.fn(),
      getHireWithClientAndMovieById: jest.fn(),
      getPendingHires: jest.fn(),
      returnMovie: jest.fn(),
    };
  });

  const hireRequestDTO = {
    client_id: 'any_client_id',
    movie_id: 'any_movie_id',
    requested_date: new Date('2025-01-01').toISOString(),
    delivery_date: new Date('2025-01-02').toISOString(),
    return_date: null,
  };

  const hireResponseDTO = {
    ...hireRequestDTO,
    id: 'any_id',
    client: {
      address: 'any_address',
      cpf: 'any_cpf',
      email: 'any_email@email.com',
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

  test('should create a hire', async () => {
    hireRepository.create.mockResolvedValue(hireResponseDTO);
    hireRepository.getHireWithClientAndMovieById.mockResolvedValue({
      client_id: 'any_client_id',
      delivery_date: '2025-01-02',
      id: 'any_id',
      movie_id: 'any_movie_id',
      requested_date: '2025-01-01',
      return_date: null,
      client: {
        address: 'any_address',
        cpf: 'any_cpf',
        email: 'any_email@email.com',
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
    });

    // const sut = new CreateHireUseCase(hireRepository, emailService);
    const sut = new CreateHireUseCase(hireRepository);

    const hire = await sut.execute(hireRequestDTO);

    expect(hire.getRight()).toBeNull();
    expect(hireRepository.create).toHaveBeenCalledTimes(1);
    expect(hireRepository.create).toHaveBeenCalledWith({
      client_id: hireRequestDTO.client_id,
      movie_id: hireRequestDTO.movie_id,
      requested_date: hireRequestDTO.requested_date,
      delivery_date: hireRequestDTO.delivery_date,
      return_date: hireRequestDTO.return_date,
    });
  });

  test('should return error if mandatory parameters are not provided', async () => {
    // const sut = new CreateHireUseCase(hireRepository, emailService);
    const sut = new CreateHireUseCase(hireRepository);

    await expect(sut.execute({} as CreateHireDTO)).rejects.toThrow(
      new AppError(AppError.missingMandatoryParameters)
    );
  });

  test('should return error if repository or emailService is not provided', async () => {
    // const sut = new CreateHireUseCase(undefined as any, emailService);
    const sut = new CreateHireUseCase(undefined as any);

    await expect(sut.execute(hireRequestDTO)).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return an Either.Left if the return date is less than the request date', async () => {
    // const sut = new CreateHireUseCase(hireRepository, emailService);
    const sut = new CreateHireUseCase(hireRepository);

    const output = await sut.execute({
      ...hireRequestDTO,
      delivery_date: new Date('2024-01-01').toISOString(),
    });

    expect(output.getLeft()).toEqual(Either.dateForReturnLessThanRequestDate);
  });

  test('should return an Either.Left if the movie is already hired by the client', async () => {
    hireRepository.thisMovieHiredByClient.mockResolvedValue(true);
    // const sut = new CreateHireUseCase(hireRepository, emailService);
    const sut = new CreateHireUseCase(hireRepository);

    const output = await sut.execute(hireRequestDTO);

    expect(output.getLeft()).toEqual(Either.movieAlreadyHiredByClient);
  });
});
