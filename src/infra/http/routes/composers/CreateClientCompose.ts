import { Request } from 'express';
import { ClientRepository } from '../../../database/typeorm/repositories/ClientRepository';
import { CreateClientUseCase } from '../../../../use-cases/CreateClientUseCase';
import { CreateClientController } from '../../controllers/CreateClientController';

export const createClientCompose = async (httpRequest: Request) => {
  const clientRepositoryFn = new ClientRepository();
  const createClientUseCaseFn = new CreateClientUseCase(clientRepositoryFn);
  const controller = new CreateClientController(
    createClientUseCaseFn,
    httpRequest
  );

  return controller.handle();
};
