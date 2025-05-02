import { Repository } from 'typeorm';
import { Client } from '../../../../domain/entities/Client';
import { IClientRepository } from '../../../../domain/repositories/IClientRepository';
import { typeormServer } from '../setup';
import { ClientTypeorm } from '../entities/Client.typeorm';

export class ClientRepository implements IClientRepository {
  private ormRepository: Repository<ClientTypeorm>;

  constructor() {
    this.ormRepository = typeormServer.getRepository(ClientTypeorm);
  }

  async create(data: Client): Promise<ClientTypeorm> {
    const client = this.ormRepository.create(data);

    await this.ormRepository.save(client);

    return client;
  }

  async findByCpf(cpf: string): Promise<ClientTypeorm | null> {
    const client = await this.ormRepository.findOneBy({ cpf });

    return client;
  }

  async findByEmail(email: string): Promise<ClientTypeorm | null> {
    const client = await this.ormRepository.findOneBy({ email });

    return client;
  }
}
