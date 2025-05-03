import { z } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { EitherType } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { IHttpRequestReturnMovie } from '../dtos/HireHttpDTO';

interface IReturnMovieUseCase {
  execute(data: {
    hire_id: string;
    return_date: string;
  }): Promise<EitherType<string>>;
}

const zodValidatorBody = z.object({
  return_date: z
    .string({
      required_error: 'return_date is required',
    })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: 'return_date must be a valid date',
      }
    ),
});

const zodValidatorParams = z.object({
  hire_id: z
    .string({
      required_error: 'hire_id is required',
    })
    .min(1, { message: 'hire_id must be at least 1 characters long' }),
});

export class ReturnMovieController {
  constructor(
    private returnMovieUseCase: IReturnMovieUseCase,
    private httpRequest: IHttpRequestReturnMovie
  ) {}

  async handle() {
    if (
      !this.returnMovieUseCase ||
      !this.httpRequest?.body ||
      !this.httpRequest?.params
    ) {
      throw new AppError(AppError.dependencies);
    }

    const { return_date } = zodValidatorBody.parse(this.httpRequest.body);
    const { hire_id } = zodValidatorParams.parse(this.httpRequest.params);

    const output = await this.returnMovieUseCase.execute({
      hire_id,
      return_date,
    });

    return output.fold(
      (error) => httpResponse(400, error),
      (message) => httpResponse(200, message)
    );
  }
}
