import { HashService } from '../../../../shared/services/HashService';
import { JwtTokenService } from '../../../../shared/services/JwtTokenService';
import { LoginUseCase } from '../../../../use-cases/LoginUseCase';
import { UserRepository } from '../../../database/typeorm/repositories/UserRepository';
import { LoginController } from '../../controllers/LoginController';
import { IHttpRequestLogin } from '../../dtos/LoginHttpDTO';

export const loginCompose = async (httpRequest: IHttpRequestLogin) => {
  const userRepository = new UserRepository();

  const hashService = new HashService();
  const jwtTokenService = new JwtTokenService();

  const loginUseCase = new LoginUseCase(
    userRepository,
    hashService,
    jwtTokenService
  );
  const output = new LoginController(loginUseCase, httpRequest);

  return await output.handle();
};
