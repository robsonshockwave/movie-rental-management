import { JwtPayload, SignOptions } from 'jsonwebtoken';

export interface ITokenService {
  generate(
    payload: string | Buffer | object,
    secret: string,
    options?: SignOptions
  ): string;
  verify(token: string, secret: string): string | JwtPayload;
}
