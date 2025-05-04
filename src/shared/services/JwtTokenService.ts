import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenService } from '../../domain/services/ITokenService';

export class JwtTokenService implements ITokenService {
  generate(
    payload: string | Buffer | object,
    secret: string,
    options: SignOptions = {}
  ): string {
    return jwt.sign(payload, secret, {
      ...options,
      expiresIn: options.expiresIn ?? '7d', // fallback para 7 dias
    });
  }

  verify(token: string, secret: string) {
    return jwt.verify(token, secret);
  }
}
