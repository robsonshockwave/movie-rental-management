import { IClientRepository } from '../domain/repositories/IClientRepository';
import { AppError } from '../shared/errors/AppError';
import { GetClientByCpfUseCase } from './GetClientByCpfUseCase';

describe('GetClientByCpfUseCase', () => {
  let clientRepository: jest.Mocked<IClientRepository>;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      findByCpf: jest.fn(),
      findByEmail: jest.fn(),
    };
  });

  const clientDTO = {
    name: 'any_name',
    cpf: 'any_cpf',
    phone: 'any_phone',
    email: 'any_email',
    address: 'any_address',
    id: 'any_id',
  };

  test('should get a client by cpf', async () => {
    clientRepository.findByCpf.mockResolvedValue(clientDTO);

    const sut = new GetClientByCpfUseCase(clientRepository);

    const client = await sut.execute(clientDTO.cpf);

    expect(client.getRight()).toEqual(clientDTO);
    expect(clientRepository.findByCpf).toHaveBeenCalledTimes(1);
    expect(clientRepository.findByCpf).toHaveBeenCalledWith(clientDTO.cpf);
  });

  test('should return error if repository is not provided', async () => {
    const sut = new GetClientByCpfUseCase(undefined as any);

    await expect(sut.execute(clientDTO.cpf)).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return error if client not found', async () => {
    clientRepository.findByCpf.mockResolvedValue(null);

    const sut = new GetClientByCpfUseCase(clientRepository);

    const client = await sut.execute(clientDTO.cpf);

    expect(client.getRight()).toBeNull();
    expect(clientRepository.findByCpf).toHaveBeenCalledTimes(1);
    expect(clientRepository.findByCpf).toHaveBeenCalledWith(clientDTO.cpf);
  });

  test('should return error if cpf is not provided', async () => {
    const sut = new GetClientByCpfUseCase(clientRepository);

    await expect(sut.execute('')).rejects.toThrow(
      new AppError(AppError.missingMandatoryParameters)
    );
  });
});
