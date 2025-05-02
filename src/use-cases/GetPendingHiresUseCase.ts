import { IHireRepository } from '../domain/repositories/IHireRepository';
import { AppError } from '../shared/utils/AppError';
import { Either } from '../shared/utils/Either';

export class GetPendingHiresUseCase {
  constructor(private hireRepository: IHireRepository) {}

  async execute() {
    if (!this.hireRepository) {
      throw new AppError(AppError.dependencies);
    }

    const hires = await this.hireRepository.getPendingHires();

    return Either.right(hires);
  }
}
