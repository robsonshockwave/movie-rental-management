import { Request } from 'express';
import { GetClientByCpfUseCase } from '../../../../use-cases/GetClientByCpfUseCase';
import { ClientRepository } from '../../../database/typeorm/repositories/ClientRepository';
import { GetClientByCpfController } from '../../controllers/GetClientByCpfController';
import { IHttpRequestGetClientByCpf } from '../../dtos/ClientHttpDTO';

export const getClientByCpfCompose = async (
  httpRequest: IHttpRequestGetClientByCpf
) => {
  const clientRepository = new ClientRepository();
  const getClientByCpfUseCase = new GetClientByCpfUseCase(clientRepository);

  const getClientByCpfController = new GetClientByCpfController(
    getClientByCpfUseCase,
    httpRequest
  );

  return await getClientByCpfController.handle();
};
