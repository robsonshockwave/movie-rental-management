import { ZodError } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { Either } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { CreateMovieController } from './CreateMovieController';

describe('GetClientByCpfController', () => {
  const createMovieUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return an httpResponse 201 and null if the registration is successful', async () => {
    createMovieUseCase.execute.mockResolvedValue(Either.right(null));

    const httpRequest = {
      body: {
        name: 'any_name',
        ISAN: '1234567890123456',
        author: 'any_author',
        genre: 'any_genre',
        quantity: 1,
      },
    };

    const sut = new CreateMovieController(createMovieUseCase, httpRequest);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(201, null));
    expect(createMovieUseCase.execute).toHaveBeenCalledTimes(1);
    expect(createMovieUseCase.execute).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return an httpResponse 400 and an error if the registration fails', async () => {
    createMovieUseCase.execute.mockResolvedValue(
      Either.left({ message: 'any_error' })
    );

    const httpRequest = {
      body: {
        name: 'any_name',
        ISAN: '1234567890123456',
        author: 'any_author',
        genre: 'any_genre',
        quantity: 1,
      },
    };

    const sut = new CreateMovieController(createMovieUseCase, httpRequest);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(400, { message: 'any_error' }));
    expect(createMovieUseCase.execute).toHaveBeenCalledTimes(1);
    expect(createMovieUseCase.execute).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return a throw AppError if createMovieUseCase and httpRequest are not provided', async () => {
    const sut = new CreateMovieController(undefined as any, undefined as any);

    await expect(sut.handle()).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  it('should return an error from the zod validator if there is an error validating the data', async () => {
    const httpRequest = {
      body: {
        name: '',
        ISAN: '',
        author: '',
        genre: '',
        quantity: 1,
      },
    };

    const sut = new CreateMovieController(createMovieUseCase, httpRequest);

    await expect(sut.handle()).rejects.toBeInstanceOf(ZodError);
  });
});
