import { ZodError } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { Either } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { CreateClientController } from './CreateClientController';

describe('CreateClientController', () => {
  const clientClientUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return an httpResponse 201 and null if the registration is successful', async () => {
    clientClientUseCase.execute.mockResolvedValue(Either.right(null));

    const httpRequest = {
      body: {
        name: 'any_name',
        address: 'any_address',
        cpf: '123.123.123-12',
        email: 'any_email@email.com',
        phone: 'any_phone',
      },
    };

    const sut = new CreateClientController(clientClientUseCase, httpRequest);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(201, null));
    expect(clientClientUseCase.execute).toHaveBeenCalledTimes(1);
    expect(clientClientUseCase.execute).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return an httpResponse 400 and an error if the registration fails', async () => {
    clientClientUseCase.execute.mockResolvedValue(
      Either.left({ message: 'any_error' })
    );

    const httpRequest = {
      body: {
        name: 'any_name',
        address: 'any_address',
        cpf: '123.123.123-12',
        email: 'any_email@email.com',
        phone: 'any_phone',
      },
    };

    const sut = new CreateClientController(clientClientUseCase, httpRequest);

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(400, { message: 'any_error' }));
    expect(clientClientUseCase.execute).toHaveBeenCalledTimes(1);
    expect(clientClientUseCase.execute).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return a throw AppError if cadastrarUsuarioUseCase and httpRequest are not provided', async () => {
    const sut = new CreateClientController(undefined as any, undefined as any);

    await expect(sut.handle()).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  it('should return an error from the zod validator if there is an error validating the data', async () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        address: 'any_address',
        cpf: '',
        email: '',
        phone: 'any_phone',
      },
    };

    const sut = new CreateClientController(clientClientUseCase, httpRequest);

    await expect(sut.handle()).rejects.toBeInstanceOf(ZodError);
  });
});
