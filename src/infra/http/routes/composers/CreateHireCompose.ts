import { CreateHireUseCase } from '../../../../use-cases/CreateHireUseCase';
import { HireRepository } from '../../../database/typeorm/repositories/HireRepository';
import { CreateHireController } from '../../controllers/CreateHireController';
import { IHttpRequestCreateHire } from '../../dtos/HireHttpDTO';

export const createHireCompose = async (
  httpRequest: IHttpRequestCreateHire
) => {
  const hireRepository = new HireRepository();
  const createHireUseCase = new CreateHireUseCase(hireRepository, {
    sendMail: () => {},
  });

  const createHireController = new CreateHireController(
    createHireUseCase,
    httpRequest
  );

  return await createHireController.handle();
};
