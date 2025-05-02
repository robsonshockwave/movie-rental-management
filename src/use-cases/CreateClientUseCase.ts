import { Client } from '../domain/entities/Client';
import { IClientRepository } from '../domain/repositories/IClientRepository';
import { AppError } from '../shared/errors/AppError';
import { Either } from '../shared/utils/Either';
import { CreateClientDTO } from './CreateClientDTO';

export class CreateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(data: CreateClientDTO) {
    if (!this.clientRepository) {
      throw new AppError(AppError.dependencies);
    }

    if (
      !data.name ||
      !data.cpf ||
      !data.phone ||
      !data.email ||
      !data.address
    ) {
      throw new AppError(AppError.missingMandatoryParameters);
    }

    const clientByCpf = await this.clientRepository.findByCpf(data.cpf);
    if (clientByCpf) {
      return Either.left(Either.valueAlreadyRegistered(data.cpf));
    }

    const clientByEmail = await this.clientRepository.findByEmail(data.email);
    if (clientByEmail) {
      return Either.left(Either.valueAlreadyRegistered(data.email));
    }

    const client = new Client(
      data.name,
      data.cpf,
      data.phone,
      data.email,
      data.address
    );

    await this.clientRepository.create(client);

    return Either.right(null);
  }
}
