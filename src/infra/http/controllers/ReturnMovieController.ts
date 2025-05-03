import { z } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { EitherType } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';

interface IHttpRequest {
  body: {
    hire_id: string;
    return_date: string;
  };
}

interface IReturnMovieUseCase {
  execute(data: {
    hire_id: string;
    return_date: string;
  }): Promise<EitherType<string>>;
}

const zodValidator = z.object({
  hire_id: z
    .string({
      required_error: 'hire_id is required',
    })
    .min(1, { message: 'hire_id must be at least 1 characters long' }),
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

export class ReturnMovieController {
  constructor(
    private returnMovieUseCase: IReturnMovieUseCase,
    private httpRequest: IHttpRequest
  ) {}

  async handle() {
    if (!this.returnMovieUseCase || !this.httpRequest?.body) {
      throw new AppError(AppError.dependencies);
    }

    const { hire_id, return_date } = zodValidator.parse(this.httpRequest.body);

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
