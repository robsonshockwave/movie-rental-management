import { Client, IClient } from '../entities/Client';

export interface IClientRepository {
  create(client: Client): Promise<IClient>;
  findByCpf(cpf: string): Promise<IClient | null>;
  findByEmail(email: string): Promise<IClient | null>;
}
