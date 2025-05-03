import { z } from 'zod';
import { IMovie } from '../../../domain/entities/Movie';
import { AppError } from '../../../shared/errors/AppError';
import { EitherType } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { IHttpRequestGetMovieByISANorName } from '../dtos/MovieHttpDTO';

interface IGetMovieByISANorNameUseCase {
  execute({ value }: { value: string }): Promise<EitherType<IMovie[]>>;
}

const zodValidator = z.object({
  value: z
    .string({
      required_error: 'value is required',
    })
    .min(1, { message: 'value must be at least 1 characters long' }),
});

export class GetMovieByISANorNameController {
  constructor(
    private getMovieByISANorNameUseCase: IGetMovieByISANorNameUseCase,
    private httpRequest: IHttpRequestGetMovieByISANorName
  ) {}

  async handle() {
    if (!this.getMovieByISANorNameUseCase || !this.httpRequest?.query) {
      throw new AppError(AppError.dependencies);
    }

    const { value } = zodValidator.parse(this.httpRequest.query);

    const output = await this.getMovieByISANorNameUseCase.execute({ value });

    return output.fold(
      (error) => httpResponse(400, error),
      (movies) => httpResponse(200, movies)
    );
  }
}
