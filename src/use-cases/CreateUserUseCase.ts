import { User } from '../domain/entities/User';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IHashService } from '../domain/services/IHashService';
import { ITokenService } from '../domain/services/ITokenService';
import { AppError } from '../shared/errors/AppError';
import { Either } from '../shared/utils/Either';
import { CreateUserDTO } from './CreateUserDTO';

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private jwtTokenService: ITokenService
  ) {}

  async execute(data: CreateUserDTO) {
    if (!this.userRepository || !this.hashService || !this.jwtTokenService) {
      throw new AppError(AppError.dependencies);
    }

    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      throw new AppError(AppError.missingMandatoryParameters);
    }

    const userByEmail = await this.userRepository.findByEmail(data.email);

    if (userByEmail) {
      return Either.left(Either.valueAlreadyRegistered(data.email));
    }

    const hashedPassword = await this.hashService.hashService(data.password);

    const user = new User(
      data.email,
      hashedPassword,
      data.firstName,
      data.lastName
    );

    const createdUser = await this.userRepository.create(user);

    const token = this.jwtTokenService.generate(
      { sub: createdUser.id },
      process.env.JWT_SECRET!
    );

    return Either.right({
      user: createdUser,
      token,
    });
  }
}
