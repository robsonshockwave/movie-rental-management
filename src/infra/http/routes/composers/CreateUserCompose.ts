import { HashService } from '../../../../shared/services/HashService';
import { JwtTokenService } from '../../../../shared/services/JwtTokenService';
import { CreateUserUseCase } from '../../../../use-cases/CreateUserUseCase';
import { UserRepository } from '../../../database/typeorm/repositories/UserRepository';
import { CreateUserController } from '../../controllers/CreateUserController';
import { IHttpRequestCreateUser } from '../../dtos/UserHttpDTO';

export const createUserCompose = async (
  httpRequest: IHttpRequestCreateUser
) => {
  const userRepository = new UserRepository();

  const hashService = new HashService();
  const jwtTokenService = new JwtTokenService();

  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    hashService,
    jwtTokenService
  );
  const output = new CreateUserController(createUserUseCase, httpRequest);

  return await output.handle();
};
