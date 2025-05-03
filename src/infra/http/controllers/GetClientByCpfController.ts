import { z } from 'zod';
import { IClient } from '../../../domain/entities/Client';
import { AppError } from '../../../shared/errors/AppError';
import { EitherType } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';
import { IHttpRequestGetClientByCpf } from '../dtos/ClientHttpDTO';

interface IGetClientByCpfUseCase {
  execute(cpf: string): Promise<EitherType<IClient | null>>;
}

const zodValidator = z.object({
  cpf: z
    .string({
      required_error: 'cpf is required',
    })
    .refine(
      (value) => {
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        return cpfRegex.test(value);
      },
      {
        message: 'invalid cpf',
      }
    ),
});

export class GetClientByCpfController {
  constructor(
    private getClientByCpfUseCase: IGetClientByCpfUseCase,
    private httpRequest: IHttpRequestGetClientByCpf
  ) {}

  async handle() {
    if (!this.getClientByCpfUseCase || !this.httpRequest?.params) {
      throw new AppError(AppError.dependencies);
    }

    const { cpf } = zodValidator.parse(this.httpRequest.params);

    const output = await this.getClientByCpfUseCase.execute(cpf);

    return output.fold(
      (error) => httpResponse(400, error),
      (client) => httpResponse(200, client)
    );
  }
}
