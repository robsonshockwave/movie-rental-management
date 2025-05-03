import { Hire } from '../../../domain/entities/Hire';

export interface IHttpRequestCreateHire {
  body: Hire;
}

export interface IHttpRequestReturnMovie {
  body: {
    return_date: string;
  };
  params: {
    hire_id: string;
  };
}
