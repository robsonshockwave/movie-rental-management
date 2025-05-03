import { ZodError } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { Either } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { GetClientByCpfController } from './GetClientByCpfController';

describe('GetClientByCpfController', () => {
  const getClientByCpfUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const clientDTO = {
    name: 'any_name',
    address: 'any_address',
    cpf: '123.123.123-12',
    email: 'any_email@email.com',
    phone: 'any_phone',
  };

  test('should return an httpResponse 200 and a client if the search is successful', async () => {
    getClientByCpfUseCase.execute.mockResolvedValue(Either.right(clientDTO));

    const httpRequest = {
      params: {
        cpf: clientDTO.cpf,
      },
    };

    const sut = new GetClientByCpfController(
      getClientByCpfUseCase,
      httpRequest
    );

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(200, clientDTO));
    expect(getClientByCpfUseCase.execute).toHaveBeenCalledTimes(1);
    expect(getClientByCpfUseCase.execute).toHaveBeenCalledWith(
      httpRequest.params.cpf
    );
  });

  test('should return an httpResponse 400 and an error if the search fails', async () => {
    getClientByCpfUseCase.execute.mockResolvedValue(
      Either.left({ message: 'any_error' })
    );

    const httpRequest = {
      params: {
        cpf: clientDTO.cpf,
      },
    };

    const sut = new GetClientByCpfController(
      getClientByCpfUseCase,
      httpRequest
    );

    const response = await sut.handle();

    expect(response).toEqual(httpResponse(400, { message: 'any_error' }));
    expect(getClientByCpfUseCase.execute).toHaveBeenCalledTimes(1);
    expect(getClientByCpfUseCase.execute).toHaveBeenCalledWith(
      httpRequest.params.cpf
    );
  });

  test('should return a throw AppError if getClientByCpfUseCase and httpRequest are not provided', async () => {
    const sut = new GetClientByCpfController(
      undefined as any,
      undefined as any
    );

    await expect(sut.handle()).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return an error from the zod validator if there is an error validating the data', async () => {
    const httpRequest = {
      params: {
        cpf: '',
      },
    };

    const sut = new GetClientByCpfController(
      getClientByCpfUseCase,
      httpRequest
    );

    await expect(sut.handle()).rejects.toBeInstanceOf(ZodError);
  });
});
