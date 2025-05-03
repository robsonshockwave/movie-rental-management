import { z } from 'zod';
import { Movie } from '../../../domain/entities/Movie';
import { AppError } from '../../../shared/errors/AppError';
import { EitherType } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { IHttpRequestCreateMovie } from '../dtos/MovieHttpDTO';

interface ICreateMovieUseCase {
  execute(movie: Movie): Promise<EitherType>;
}

const zodValidator = z.object({
  name: z
    .string({
      required_error: 'name is required',
    })
    .min(3, { message: 'name must be at least 3 characters long' }),
  author: z
    .string({
      required_error: 'author is required',
    })
    .min(3, { message: 'name must be at least 3 characters long' }),
  genre: z
    .string({
      required_error: 'genre is required',
    })
    .min(3, { message: 'name must be at least 3 characters long' }),
  quantity: z.number({
    required_error: 'quantity is required',
  }),
  ISAN: z
    .string({
      required_error: 'ISAN is required',
    })
    .min(16, { message: 'name must be at least 16 characters long' }),
});

export class CreateMovieController {
  constructor(
    private createMovieUseCase: ICreateMovieUseCase,
    private httpRequest: IHttpRequestCreateMovie
  ) {}

  async handle() {
    if (!this.createMovieUseCase || !this.httpRequest?.body) {
      throw new AppError(AppError.dependencies);
    }

    const { name, ISAN, author, genre, quantity } = zodValidator.parse(
      this.httpRequest.body
    );

    const output = await this.createMovieUseCase.execute({
      name,
      ISAN,
      author,
      genre,
      quantity,
    });

    return output.fold(
      (error) => httpResponse(400, error),
      () => httpResponse(201, null)
    );
  }
}
