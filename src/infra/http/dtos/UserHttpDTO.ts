export interface IHttpRequestCreateUser {
  body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
}
