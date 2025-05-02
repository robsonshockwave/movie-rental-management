import { IClientRepository } from '../domain/repositories/IClientRepository';
import { AppError } from '../shared/utils/AppError';
import { Either } from '../shared/utils/Either';

export class GetClientByCpfUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(cpf: string) {
    if (!this.clientRepository) {
      throw new AppError(AppError.dependencies);
    }

    if (!cpf) {
      throw new AppError(AppError.missingMandatoryParameters);
    }

    const client = await this.clientRepository.findByCpf(cpf);

    return Either.right(client);
  }
}
