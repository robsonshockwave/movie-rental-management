import { ZodError } from 'zod';
import { Either } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { CreateUserController } from './CreateUserController';
import { AppError } from '../../../shared/errors/AppError';

describe('CreateUserController', () => {
  const createUserUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userRequestDTO = {
    firstName: 'any_firstName',
    lastName: 'any_lastName',
    email: 'any_email@email.com',
    password: 'any_password',
  };

  const userResponseDTO = {
    ...userRequestDTO,
    token: 'any_token',
  };

  test('should return an httpResponse 201 and a user if the registration is successful', async () => {
    createUserUseCase.execute.mockResolvedValue(Either.right(userResponseDTO));

    const httpRequest = {
      body: userRequestDTO,
    };

    const sut = new CreateUserController(createUserUseCase, httpRequest);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(201, userResponseDTO));
    expect(createUserUseCase.execute).toHaveBeenCalledTimes(1);
    expect(createUserUseCase.execute).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return an httpResponse 400 and an error if the registration fails', async () => {
    createUserUseCase.execute.mockResolvedValue(
      Either.left({ message: 'any_error' })
    );

    const httpRequest = {
      body: userRequestDTO,
    };

    const sut = new CreateUserController(createUserUseCase, httpRequest);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(400, { message: 'any_error' }));
    expect(createUserUseCase.execute).toHaveBeenCalledTimes(1);
    expect(createUserUseCase.execute).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return a throw AppError if createUserUseCase and httpRequest are not provided', async () => {
    const sut = new CreateUserController(undefined as any, undefined as any);

    await expect(sut.handle()).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return an error from the zod validator if there is an error validating the data', async () => {
    const httpRequest = {
      body: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
    };

    const sut = new CreateUserController(createUserUseCase, httpRequest);

    await expect(sut.handle()).rejects.toBeInstanceOf(ZodError);
  });
});
