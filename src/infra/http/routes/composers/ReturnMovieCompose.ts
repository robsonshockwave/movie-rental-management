import { ReturnMovieUseCase } from '../../../../use-cases/ReturnMovieUseCase';
import { HireRepository } from '../../../database/typeorm/repositories/HireRepository';
import { ReturnMovieController } from '../../controllers/ReturnMovieController';
import { IHttpRequestReturnMovie } from '../../dtos/HireHttpDTO';

export const returnMovieCompose = async (
  httpRequest: IHttpRequestReturnMovie
) => {
  const hireRepository = new HireRepository();
  const returnMovieUseCase = new ReturnMovieUseCase(hireRepository);

  const controller = new ReturnMovieController(returnMovieUseCase, httpRequest);

  return await controller.handle();
};
