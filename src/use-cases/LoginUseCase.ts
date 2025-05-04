import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IHashService } from '../domain/services/IHashService';
import { ITokenService } from '../domain/services/ITokenService';
import { AppError } from '../shared/errors/AppError';
import { Either } from '../shared/utils/Either';
import { LoginDTO } from './LoginDTO';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private jwtTokenService: ITokenService
  ) {}

  async execute(data: LoginDTO) {
    if (!this.userRepository) {
      throw new AppError(AppError.dependencies);
    }

    if (!data.email || !data.password) {
      throw new AppError(AppError.missingMandatoryParameters);
    }

    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      return Either.left(Either.emailOrPasswordInvalid);
    }

    const isValidPassword = await this.hashService.compareService(
      data.password,
      user.password
    );

    if (!isValidPassword) {
      return Either.left(Either.emailOrPasswordInvalid);
    }

    const token = this.jwtTokenService.generate(
      { id: user.id },
      process.env.JWT_SECRET!
    );

    return Either.right({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  }
}
