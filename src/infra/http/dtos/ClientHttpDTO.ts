import { Client } from '../../../domain/entities/Client';

export interface IHttpRequestCreateClient {
  body: Client;
}

export interface IHttpRequestGetClientByCpf {
  params: {
    cpf: string;
  };
}
