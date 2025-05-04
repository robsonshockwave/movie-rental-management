import { Hire } from '../domain/entities/Hire';
import { IHireRepository } from '../domain/repositories/IHireRepository';
import { IMailService } from '../domain/services/IMailService';
import { AppError } from '../shared/errors/AppError';
import { Either } from '../shared/utils/Either';
import { CreateHireDTO } from './CreateHireDTO';

export class CreateHireUseCase {
  constructor(
    private hireRepository: IHireRepository,
    private emailService: IMailService
  ) {}

  private isValidDate(date: unknown): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  async execute(data: CreateHireDTO) {
    if (!this.hireRepository || !this.emailService) {
      throw new AppError(AppError.dependencies);
    }

    if (
      !data.client_id ||
      !data.movie_id ||
      !data.requested_date ||
      !data.delivery_date
    ) {
      throw new AppError(AppError.missingMandatoryParameters);
    }

    if (
      !this.isValidDate(new Date(data.requested_date)) ||
      !this.isValidDate(new Date(data.delivery_date))
    ) {
      throw new AppError(AppError.invalidDates);
    }

    if (new Date(data.requested_date) > new Date(data.delivery_date)) {
      return Either.left(Either.dateForReturnLessThanRequestDate);
    }

    const thisMovieHiredByClient =
      await this.hireRepository.thisMovieHiredByClient(
        data.client_id,
        data.movie_id
      );

    if (thisMovieHiredByClient) {
      return Either.left(Either.movieAlreadyHiredByClient);
    }

    const hire = new Hire(
      data.client_id,
      data.movie_id,
      data.requested_date,
      data.delivery_date
    );

    const hireCreated = await this.hireRepository.create(hire);

    const { client, movie } =
      await this.hireRepository.getHireWithClientAndMovieById(hireCreated.id);

    await this.emailService.sendMail({
      requested_date: data.requested_date,
      delivery_date: data.delivery_date,
      client_name: client.name,
      cpf: client.cpf,
      email: client.email,
      movie_name: movie.name,
    });

    return Either.right(null);
  }
}
