import { Movie } from '../domain/entities/Movie';
import { IMovieRepository } from '../domain/repositories/IMovieRepository';
import { AppError } from '../shared/errors/AppError';
import { Either } from '../shared/utils/Either';
import { CreateMovieDTO } from './CreateMovieDTO';

export class CreateMovieUseCase {
  constructor(private movieRepository: IMovieRepository) {}

  async execute(data: CreateMovieDTO) {
    if (!this.movieRepository) {
      throw new AppError(AppError.dependencies);
    }

    if (
      !data.name ||
      !data.ISAN ||
      !data.author ||
      !data.quantity ||
      !data.genre
    ) {
      throw new AppError(AppError.missingMandatoryParameters);
    }

    const movieByISAN = await this.movieRepository.findByISAN(data.ISAN);

    if (movieByISAN) {
      return Either.left(Either.valueAlreadyRegistered(data.ISAN));
    }

    const movie = new Movie(
      data.name,
      data.genre,
      data.quantity,
      data.ISAN,
      data.author
    );

    await this.movieRepository.create(movie);

    return Either.right(null);
  }
}
