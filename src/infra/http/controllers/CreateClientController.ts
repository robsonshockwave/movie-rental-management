import { z } from 'zod';
import { Client } from '../../../domain/entities/Client';
import { AppError } from '../../../shared/errors/AppError';
import { EitherType } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';

interface IHttpRequest {
  body: Client;
}

interface IClientClientUseCase {
  execute(client: Client): Promise<EitherType>;
}

const zodValidator = z.object({
  name: z.string({
    required_error: 'name is required',
  }),
  address: z.string({
    required_error: 'address is required',
  }),
  cpf: z
    .string({
      required_error: 'cpf is required',
    })
    .refine((value) => {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      return cpfRegex.test(value);
    }),
  email: z
    .string({
      required_error: 'email is required',
    })
    .email({
      message: 'invalid email',
    }),
  phone: z.string({
    required_error: 'phone is required',
  }),
});

export class CreateClientController {
  private clientClientUseCase;
  private httpRequest;

  constructor(
    clientClientUseCase: IClientClientUseCase,
    httpRequest: IHttpRequest
  ) {
    this.clientClientUseCase = clientClientUseCase;
    this.httpRequest = httpRequest;
  }

  async handle() {
    if (!this.clientClientUseCase || !this.httpRequest?.body) {
      throw new AppError(AppError.dependencies);
    }

    const { name, address, cpf, email, phone } = zodValidator.parse(
      this.httpRequest.body
    );

    const output = await this.clientClientUseCase.execute({
      name,
      address,
      cpf,
      email,
      phone,
    });

    return output.fold(
      (error) => httpResponse(400, error),
      () => httpResponse(201, null)
    );
  }
}
