import { z } from 'zod';
import { IUser, User } from '../../../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';
import { EitherType } from '../../../shared/utils/Either';
import { IHttpRequestCreateUser } from '../dtos/UserHttpDTO';
import { httpResponse } from '../../../shared/utils/HttpResponse';

interface ICreateUserUseCase {
  execute(data: User): Promise<
    EitherType<{
      user: IUser;
      token: string;
    } | null>
  >;
}

const zodValidator = z.object({
  firstName: z
    .string({
      required_error: 'firstName is required',
    })
    .min(3, { message: 'name must be at least 3 characters long' }),
  lastName: z
    .string({
      required_error: 'lastName is required',
    })
    .min(3, { message: 'name must be at least 3 characters long' }),
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
    .min(5, { message: 'password must be at least 5 characters long' }),
});

export class CreateUserController {
  constructor(
    private createUserUseCase: ICreateUserUseCase,
    private httpRequest: IHttpRequestCreateUser
  ) {}

  async handle() {
    if (!this.createUserUseCase || !this.httpRequest?.body) {
      throw new AppError(AppError.dependencies);
    }

    const { firstName, lastName, email, password } = zodValidator.parse(
      this.httpRequest.body
    );

    const output = await this.createUserUseCase.execute({
      email,
      password,
      firstName,
      lastName,
    });

    return output.fold(
      (error) => httpResponse(400, error),
      (data) => httpResponse(201, data)
    );
  }
}
