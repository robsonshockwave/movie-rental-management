export interface IMailData {
  requested_date: string;
  delivery_date: string;
  client_name: string;
  cpf: string;
  email: string;
  movie_name: string;
}

export interface IMailService {
  sendMail(data: IMailData): Promise<void>;
}
