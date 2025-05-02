import { Client } from '../entities/Client';

export interface IClientRepository {
  create(client: Client): Promise<Client>;
  findByCpf(cpf: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
}
