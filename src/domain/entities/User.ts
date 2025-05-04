export class User {
  constructor(
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string
  ) {}
}

export type IUser = User & {
  id: string;
};

export type ILogin = {
  email: string;
  password: string;
};
