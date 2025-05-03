import { GetMovieByISANorNameUseCase } from '../../../../use-cases/GetMovieByISANorNameUseCase';
import { MovieRepository } from '../../../database/typeorm/repositories/MovieRepository';
import { GetMovieByISANorNameController } from '../../controllers/GetMovieByISANorNameController';
import { IHttpRequestGetMovieByISANorName } from '../../dtos/MovieHttpDTO';

export const GetMovieByISANorNameCompose = async (
  httpRequest: IHttpRequestGetMovieByISANorName
) => {
  const movieRepository = new MovieRepository();
  const getMovieByISANorNameUseCase = new GetMovieByISANorNameUseCase(
    movieRepository
  );

  const getMovieByISANorNameController = new GetMovieByISANorNameController(
    getMovieByISANorNameUseCase,
    httpRequest
  );

  return await getMovieByISANorNameController.handle();
};
