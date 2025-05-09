export class Client {
  constructor(
    public name: string,
    public cpf: string,
    public phone: string,
    public email: string,
    public address: string
  ) {}
}

// model
export type IClient = Client & {
  id: string;
};
