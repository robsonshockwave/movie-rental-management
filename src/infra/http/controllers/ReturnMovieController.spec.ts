import { ZodError } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { Either } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { ReturnMovieController } from './ReturnMovieController';

describe('ReturnMovieController', () => {
  const returnMovieUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return an httpResponse 200 and a message if the return is successful', async () => {
    returnMovieUseCase.execute.mockResolvedValue(Either.right('any_message'));

    const httpRequest = {
      body: {
        return_date: new Date('2025-01-04').toISOString(),
      },
      params: {
        hire_id: 'any_hire_id',
      },
    };

    const sut = new ReturnMovieController(returnMovieUseCase, httpRequest);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(200, 'any_message'));
    expect(returnMovieUseCase.execute).toHaveBeenCalledTimes(1);
    expect(returnMovieUseCase.execute).toHaveBeenCalledWith({
      ...httpRequest.body,
      ...httpRequest.params,
    });
  });

  test('should return an httpResponse 400 and an error if the return fails', async () => {
    returnMovieUseCase.execute.mockResolvedValue(
      Either.left({ message: 'any_error' })
    );

    const httpRequest = {
      body: {
        return_date: new Date('2025-01-04').toISOString(),
      },
      params: {
        hire_id: 'any_hire_id',
      },
    };

    const sut = new ReturnMovieController(returnMovieUseCase, httpRequest);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(400, { message: 'any_error' }));
    expect(returnMovieUseCase.execute).toHaveBeenCalledTimes(1);
    expect(returnMovieUseCase.execute).toHaveBeenCalledWith({
      ...httpRequest.body,
      ...httpRequest.params,
    });
  });

  test('should return a throw AppError if returnMovieUseCase and httpRequest are not provided', async () => {
    const sut = new ReturnMovieController(undefined as any, undefined as any);

    await expect(sut.handle()).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return an error from the zod validator if there is an error validating the data', async () => {
    const httpRequest = {
      body: {
        return_date: '',
      },
      params: {
        hire_id: 'any_hire_id',
      },
    };

    const sut = new ReturnMovieController(returnMovieUseCase, httpRequest);

    await expect(sut.handle()).rejects.toBeInstanceOf(ZodError);
  });
});
