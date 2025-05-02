import { ClientTypeorm } from '../entities/Client';
import { typeormServer } from '../setup';
import { ClientRepository } from './ClientRepository';

describe('ClientRepository', () => {
  const clientRepository = typeormServer.getRepository(ClientTypeorm);
  const sut = new ClientRepository();

  beforeEach(async () => {
    await clientRepository.delete({});
  });

  const clientDTO = {
    name: 'any_name',
    cpf: 'any_cpf',
    phone: 'any_phone',
    email: 'any_email',
    address: 'any_address',
  };

  test('should create a client', async () => {
    const client = await sut.create(clientDTO);

    expect(client).toEqual({
      id: expect.any(String),
      ...clientDTO,
    });
  });

  test('should find a client by cpf', async () => {
    await clientRepository.save(clientDTO);

    const client = await sut.findByCpf('any_cpf');

    expect(client).toEqual({
      id: expect.any(String),
      ...clientDTO,
    });
  });

  test('should find a client by cpf', async () => {
    const client = await sut.findByCpf('not_registered_cpf');

    expect(client).toBeNull();
  });

  test('should find a client by email', async () => {
    await clientRepository.save(clientDTO);

    const client = await sut.findByEmail('any_email');

    expect(client).toEqual({
      id: expect.any(String),
      ...clientDTO,
    });
  });

  test('should find a client by email', async () => {
    const client = await sut.findByEmail('not_registered_email');

    expect(client).toBeNull();
  });
});
