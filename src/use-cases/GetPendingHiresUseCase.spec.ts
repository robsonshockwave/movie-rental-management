import { IHireRepository } from '../domain/repositories/IHireRepository';
import { AppError } from '../shared/errors/AppError';
import { GetPendingHiresUseCase } from './GetPendingHiresUseCase';

describe('GetPendingHiresUseCase', () => {
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

  const hiresResponseDTO = [
    {
      client_id: 'any_client_id',
      delivery_date: '2025-01-02',
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
    },
  ];

  test('should get pending hires', async () => {
    hireRepository.getPendingHires.mockResolvedValue(hiresResponseDTO);
    const sut = new GetPendingHiresUseCase(hireRepository);

    const output = await sut.execute();

    expect(output.getRight()).toEqual(hiresResponseDTO);
    expect(hireRepository.getPendingHires).toHaveBeenCalledTimes(1);
    expect(output.getRight()?.length).toEqual(1);
    expect(output.getRight()?.[0].client.name).toEqual(
      hiresResponseDTO[0].client.name
    );
  });

  test('should return error if repository is not provided', async () => {
    const sut = new GetPendingHiresUseCase(undefined as any);

    await expect(sut.execute()).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });
});
