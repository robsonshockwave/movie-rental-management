import { ZodError } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { Either } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { CreateHireController } from './CreateHireController';

describe('CreateHireController', () => {
  const createHireUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return an httpResponse 201 and null if the registration is successful', async () => {
    createHireUseCase.execute.mockResolvedValue(Either.right(null));

    const httpRequest = {
      body: {
        client_id: 'any_client_id',
        movie_id: 'any_movie_id',
        delivery_date: new Date('2025-01-04').toISOString(),
        requested_date: new Date('2025-01-01').toISOString(),
      },
    };

    const sut = new CreateHireController(createHireUseCase, httpRequest);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(201, null));
    expect(createHireUseCase.execute).toHaveBeenCalledTimes(1);
    expect(createHireUseCase.execute).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return an httpResponse 400 and an error if the registration fails', async () => {
    createHireUseCase.execute.mockResolvedValue(
      Either.left({ message: 'any_error' })
    );

    const httpRequest = {
      body: {
        client_id: 'any_client_id',
        movie_id: 'any_movie_id',
        delivery_date: new Date('2025-01-04').toISOString(),
        requested_date: new Date('2025-01-01').toISOString(),
      },
    };

    const sut = new CreateHireController(createHireUseCase, httpRequest);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(400, { message: 'any_error' }));
    expect(createHireUseCase.execute).toHaveBeenCalledTimes(1);
    expect(createHireUseCase.execute).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return a throw AppError if createHireUseCase and httpRequest are not provided', async () => {
    const sut = new CreateHireController(undefined as any, undefined as any);

    await expect(sut.handle()).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return an error from the zod validator if there is an error validating the data', async () => {
    const httpRequest = {
      body: {
        client_id: 'any_client_id',
        movie_id: 'any_movie_id',
        delivery_date: '',
        requested_date: '',
      },
    };

    const sut = new CreateHireController(createHireUseCase, httpRequest);

    await expect(sut.handle()).rejects.toBeInstanceOf(ZodError);
  });
});
