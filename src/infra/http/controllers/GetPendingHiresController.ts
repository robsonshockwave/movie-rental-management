import { IHire } from '../../../domain/entities/Hire';
import { AppError } from '../../../shared/errors/AppError';
import { EitherType } from '../../../shared/utils/Either';
import { httpResponse } from '../../../shared/utils/HttpResponse';

interface IGetPendingHiresUseCase {
  execute(): Promise<EitherType<IHire[]>>;
}

export class GetPendingHiresController {
  constructor(private getPendingHiresUseCase: IGetPendingHiresUseCase) {}

  async handle() {
    if (!this.getPendingHiresUseCase) {
      throw new AppError(AppError.dependencies);
    }

    const output = await this.getPendingHiresUseCase.execute();

    return output.fold(
      (error) => httpResponse(400, error),
      (hires) => httpResponse(200, hires)
    );
  }
}
