import { ZodError } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { Either } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { GetMovieByISANorNameController } from './GetMovieByISANorNameController';

describe('GetMovieByISANorNameController', () => {
  const getMovieByISANorNameUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return an httpResponse 200 and a movie if the search is successful', async () => {
    getMovieByISANorNameUseCase.execute.mockResolvedValue(Either.right([]));

    const httpRequest = {
      query: {
        value: 'any_value',
      },
    };

    const sut = new GetMovieByISANorNameController(
      getMovieByISANorNameUseCase,
      httpRequest
    );

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(200, []));
    expect(getMovieByISANorNameUseCase.execute).toHaveBeenCalledTimes(1);
    expect(getMovieByISANorNameUseCase.execute).toHaveBeenCalledWith(
      httpRequest.query
    );
  });

  test('should return an httpResponse 400 and an error if the search fails', async () => {
    getMovieByISANorNameUseCase.execute.mockResolvedValue(
      Either.left({ message: 'any_error' })
    );

    const httpRequest = {
      query: {
        value: 'any_value',
      },
    };

    const sut = new GetMovieByISANorNameController(
      getMovieByISANorNameUseCase,
      httpRequest
    );

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(400, { message: 'any_error' }));
    expect(getMovieByISANorNameUseCase.execute).toHaveBeenCalledTimes(1);
    expect(getMovieByISANorNameUseCase.execute).toHaveBeenCalledWith(
      httpRequest.query
    );
  });

  test('should return a throw AppError if getMovieByISANorNameUseCase and httpRequest are not provided', async () => {
    const sut = new GetMovieByISANorNameController(
      undefined as any,
      undefined as any
    );

    await expect(sut.handle()).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return an error from the zod validator if there is an error validating the data', async () => {
    const httpRequest = {
      query: {
        value: '',
      },
    };

    const sut = new GetMovieByISANorNameController(
      getMovieByISANorNameUseCase,
      httpRequest
    );

    await expect(sut.handle()).rejects.toBeInstanceOf(ZodError);
  });
});
