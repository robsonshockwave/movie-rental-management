import { z } from 'zod';
import { AppError } from '../../../shared/errors/AppError';
import { EitherType } from '../../../shared/utils/Either';
import { IHttpRequestLogin } from '../dtos/LoginHttpDTO';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { ILogin } from '../../../domain/entities/User';

interface ILoginUseCase {
  execute(data: ILogin): Promise<
    EitherType<{
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      };
      token: string;
    } | null>
  >;
}

const zodValidator = z.object({
  email: z
    .string({
      required_error: 'email is required',
    })
    .email({
      message: 'invalid email',
    }),
  password: z
    .string({
      required_error: 'password is required',
    })
    .min(1, { message: 'password is required' }),
});

export class LoginController {
  constructor(
    private loginUseCase: ILoginUseCase,
    private httpRequest: IHttpRequestLogin
  ) {}

  async handle() {
    if (!this.loginUseCase || !this.httpRequest?.body) {
      throw new AppError(AppError.dependencies);
    }

    const { email, password } = zodValidator.parse(this.httpRequest.body);

    const output = await this.loginUseCase.execute({
      email,
      password,
    });

    return output.fold(
      (error) => httpResponse(400, error),
      (data) => httpResponse(200, data)
    );
  }
}
