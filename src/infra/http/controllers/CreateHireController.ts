import { z } from 'zod';
import { Hire } from '../../../domain/entities/Hire';
import { AppError } from '../../../shared/errors/AppError';
import { EitherType } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { IHttpRequestCreateHire } from '../dtos/HireHttpDTO';

interface ICreateHireUseCase {
  execute(hire: Hire): Promise<EitherType>;
}

const zodValidator = z.object({
  client_id: z
    .string({
      required_error: 'client_id is required',
    })
    .min(1, { message: 'client_id must be at least 1 characters long' }),
  movie_id: z
    .string({
      required_error: 'movie_id is required',
    })
    .min(1, { message: 'movie_id must be at least 1 characters long' }),
  requested_date: z
    .string({
      required_error: 'requested_date is required',
    })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: 'requested_date must be a valid date',
      }
    ),
  delivery_date: z
    .string({
      required_error: 'delivery_date is required',
    })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: 'delivery_date must be a valid date',
      }
    ),
});

export class CreateHireController {
  constructor(
    private createHireUseCase: ICreateHireUseCase,
    private httpRequest: IHttpRequestCreateHire
  ) {}

  async handle() {
    if (!this.createHireUseCase || !this.httpRequest?.body) {
      throw new AppError(AppError.dependencies);
    }

    const { client_id, delivery_date, movie_id, requested_date } =
      zodValidator.parse(this.httpRequest.body);

    const output = await this.createHireUseCase.execute({
      client_id,
      delivery_date,
      movie_id,
      requested_date,
    });

    return output.fold(
      (error) => httpResponse(400, error),
      () => httpResponse(201, null)
    );
  }
}
