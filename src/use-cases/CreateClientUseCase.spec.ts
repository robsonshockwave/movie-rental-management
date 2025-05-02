import { IClientRepository } from '../domain/repositories/IClientRepository';
import { AppError } from '../shared/utils/AppError';
import { Either } from '../shared/utils/Either';
import { CreateClientDTO } from './CreateClientDTO';
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

  const clientRequestDTO = {
    name: 'any_name',
    cpf: 'any_cpf',
    phone: 'any_phone',
    email: 'any_email',
    address: 'any_address',
  };

  const clientResponseDTO = {
    ...clientRequestDTO,
    id: 'any_id',
  };

  test('should create a client', async () => {
    const sut = new CreateClientUseCase(clientRepository);

    const client = await sut.execute(clientRequestDTO);

    expect(client.getRight()).toBeNull();
    expect(clientRepository.create).toHaveBeenCalledTimes(1);
    expect(clientRepository.create).toHaveBeenCalledWith(clientRequestDTO);
  });

  test('should return error if repository is not provided', async () => {
    const sut = new CreateClientUseCase(undefined as any);

    await expect(sut.execute(clientRequestDTO)).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return error if client already exists by cpf', async () => {
    clientRepository.findByCpf.mockResolvedValue(clientResponseDTO);

    const sut = new CreateClientUseCase(clientRepository);

    const client = await sut.execute(clientRequestDTO);

    expect(client.getRight()).toBeNull();
    expect(client.getLeft()).toEqual(
      Either.valueAlreadyRegistered(clientRequestDTO.cpf)
    );
    expect(clientRepository.findByCpf).toHaveBeenCalledTimes(1);
    expect(clientRepository.findByCpf).toHaveBeenCalledWith(
      clientRequestDTO.cpf
    );
  });

  test('should return error if client already exists by email', async () => {
    clientRepository.findByEmail.mockResolvedValue(clientResponseDTO);

    const sut = new CreateClientUseCase(clientRepository);

    const client = await sut.execute(clientRequestDTO);

    expect(client.getRight()).toBeNull();
    expect(client.getLeft()).toEqual(
      Either.valueAlreadyRegistered(clientRequestDTO.email)
    );
    expect(clientRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(clientRepository.findByEmail).toHaveBeenCalledWith(
      clientRequestDTO.email
    );
  });

  test('should return error if mandatory parameters are not provided', async () => {
    const sut = new CreateClientUseCase(clientRepository);

    await expect(
      sut.execute({
        name: 'any_name',
      } as CreateClientDTO)
    ).rejects.toThrow(new AppError(AppError.missingMandatoryParameters));
  });
});
