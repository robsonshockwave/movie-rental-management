import { IMovieRepository } from '../domain/repositories/IMovieRepository';
import { AppError } from '../shared/utils/AppError';
import { Either } from '../shared/utils/Either';
import { GetMovieByISANorNameDTO } from './GetMovieByISANorNameDTO';

export class GetMovieByISANorNameUseCase {
  constructor(private movieRepository: IMovieRepository) {}

  async execute({ value }: GetMovieByISANorNameDTO) {
    if (!this.movieRepository) {
      throw new AppError(AppError.dependencies);
    }

    if (!value) {
      throw new AppError(AppError.missingMandatoryParameters);
    }

    const movie = await this.movieRepository.findByISANorName(value);

    return Either.right(movie);
  }
}
