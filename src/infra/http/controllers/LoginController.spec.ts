import { ZodError } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { Either } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { LoginController } from './LoginController';

describe('LoginController', () => {
  const loginUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const loginResponseDTO = {
    user: {
      id: 'any_id',
      email: 'any_email@email.com',
      firstName: 'any_firstName',
      lastName: 'any_lastName',
    },
    token: 'any_token',
  };

  test('should return an httpResponse 200 and a token if the login is successful', async () => {
    loginUseCase.execute.mockResolvedValue(Either.right(loginResponseDTO));

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };

    const sut = new LoginController(loginUseCase, httpRequest);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(200, loginResponseDTO));
    expect(loginUseCase.execute).toHaveBeenCalledTimes(1);
    expect(loginUseCase.execute).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return a throw AppError if loginUseCase and httpRequest are not provided', async () => {
    const sut = new LoginController(undefined as any, undefined as any);

    await expect(sut.handle()).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return an error from the zod validator if there is an error validating the data', async () => {
    const httpRequest = {
      body: {
        email: '',
        password: '',
      },
    };

    const sut = new LoginController(loginUseCase, httpRequest);

    await expect(sut.handle()).rejects.toBeInstanceOf(ZodError);
  });
});
