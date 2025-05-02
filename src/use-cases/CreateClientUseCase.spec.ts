import { IClientRepository } from '../domain/repositories/IClientRepository';
import { AppError } from '../shared/utils/AppError';
import { Either } from '../shared/utils/Either';
import { CreateClientUseCase } from './CreateClientUseCase';

describe('CreateClientUseCase', () => {
  let clientRepository: jest.Mocked<IClientRepository>;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      findByCpf: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn().mockResolvedValue(null),
    };
  });

  const clientDTO = {
    name: 'any_name',
    cpf: 'any_cpf',
    phone: 'any_phone',
    email: 'any_email',
    address: 'any_address',
  };

  test('should create a client', async () => {
    const sut = new CreateClientUseCase(clientRepository);

    const client = await sut.execute(clientDTO);

    expect(client.getRight()).toBeNull();
    expect(clientRepository.create).toHaveBeenCalledTimes(1);
    expect(clientRepository.create).toHaveBeenCalledWith(clientDTO);
  });

  test('should return error if repository is not provided', async () => {
    const sut = new CreateClientUseCase(undefined as any);

    await expect(sut.execute(clientDTO)).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return error if client already exists by cpf', async () => {
    clientRepository.findByCpf.mockResolvedValue(clientDTO);

    const sut = new CreateClientUseCase(clientRepository);

    const client = await sut.execute(clientDTO);

    expect(client.getRight()).toBeNull();
    expect(client.getLeft()).toEqual(
      Either.valueAlreadyRegistered(clientDTO.cpf)
    );
    expect(clientRepository.findByCpf).toHaveBeenCalledTimes(1);
    expect(clientRepository.findByCpf).toHaveBeenCalledWith(clientDTO.cpf);
  });

  test('should return error if client already exists by email', async () => {
    clientRepository.findByEmail.mockResolvedValue(clientDTO);

    const sut = new CreateClientUseCase(clientRepository);

    const client = await sut.execute(clientDTO);

    expect(client.getRight()).toBeNull();
    expect(client.getLeft()).toEqual(
      Either.valueAlreadyRegistered(clientDTO.email)
    );
    expect(clientRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(clientRepository.findByEmail).toHaveBeenCalledWith(clientDTO.email);
  });
});
