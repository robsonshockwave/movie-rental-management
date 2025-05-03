import { IHireRepository } from '../domain/repositories/IHireRepository';
import { Late } from '../domain/value-objects/Late';
import { AppError } from '../shared/errors/AppError';
import { Either } from '../shared/utils/Either';
import { ReturnMovieDTO } from './ReturnMovieDTO';

export class ReturnMovieUseCase {
  constructor(private hireRepository: IHireRepository) {}

  async execute(data: ReturnMovieDTO) {
    if (!this.hireRepository) {
      throw new AppError(AppError.dependencies);
    }

    if (!data.hire_id || !data.return_date) {
      throw new AppError(AppError.missingMandatoryParameters);
    }

    const { delivery_date } = await this.hireRepository.returnMovie(
      data.hire_id,
      data.return_date
    );

    const late = new Late({
      delivery_date,
      return_date: data.return_date,
    });

    return Either.right(late.fineMessage());
  }
}
