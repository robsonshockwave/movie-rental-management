import { CreateMovieUseCase } from '../../../../use-cases/CreateMovieUseCase';
import { MovieRepository } from '../../../database/typeorm/repositories/MovieRepository';
import { CreateMovieController } from '../../controllers/CreateMovieController';
import { IHttpRequestCreateMovie } from '../../dtos/MovieHttpDTO';

export const CreateMovieCompose = async (
  httpRequest: IHttpRequestCreateMovie
) => {
  const movieRepository = new MovieRepository();
  const createMovieUseCase = new CreateMovieUseCase(movieRepository);

  const createMovieController = new CreateMovieController(
    createMovieUseCase,
    httpRequest
  );

  return await createMovieController.handle();
};
