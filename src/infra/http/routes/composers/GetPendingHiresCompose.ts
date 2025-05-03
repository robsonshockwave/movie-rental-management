import { GetPendingHiresUseCase } from '../../../../use-cases/GetPendingHiresUseCase';
import { HireRepository } from '../../../database/typeorm/repositories/HireRepository';
import { GetPendingHiresController } from '../../controllers/GetPendingHiresController';

export const getPendingHiresCompose = async () => {
  const hireRepository = new HireRepository();
  const getPendingHiresUseCase = new GetPendingHiresUseCase(hireRepository);

  const controller = new GetPendingHiresController(getPendingHiresUseCase);

  return await controller.handle();
};
