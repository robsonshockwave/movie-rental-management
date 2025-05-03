import { Request } from 'express';
import { ClientRepository } from '../../../database/typeorm/repositories/ClientRepository';
import { CreateClientUseCase } from '../../../../use-cases/CreateClientUseCase';
import { CreateClientController } from '../../controllers/CreateClientController';
import { IHttpRequestCreateClient } from '../../dtos/ClientHttpDTO';

export const createClientCompose = async (
  httpRequest: IHttpRequestCreateClient
) => {
  const clientRepository = new ClientRepository();
  const createClientUseCase = new CreateClientUseCase(clientRepository);

  const createClientController = new CreateClientController(
    createClientUseCase,
    httpRequest
  );

  return await createClientController.handle();
};
