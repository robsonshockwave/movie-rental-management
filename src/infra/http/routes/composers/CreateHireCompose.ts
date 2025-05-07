import { CreateHireUseCase } from '../../../../use-cases/CreateHireUseCase';
import { HireRepository } from '../../../database/typeorm/repositories/HireRepository';
// import { nodemailerService } from '../../../mail/nodemailer';
import { CreateHireController } from '../../controllers/CreateHireController';
import { IHttpRequestCreateHire } from '../../dtos/HireHttpDTO';

export const createHireCompose = async (
  httpRequest: IHttpRequestCreateHire
) => {
  // const emailService = nodemailerService();

  const hireRepository = new HireRepository();
  const createHireUseCase = new CreateHireUseCase(
    hireRepository
    // emailService
  );

  const createHireController = new CreateHireController(
    createHireUseCase,
    httpRequest
  );

  return await createHireController.handle();
};
