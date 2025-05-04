import { IUserRepository } from '../domain/repositories/IUserRepository';
import { AppError } from '../shared/errors/AppError';
import { HashService } from '../shared/services/HashService';
import { JwtTokenService } from '../shared/services/JwtTokenService';
import { Either } from '../shared/utils/Either';
import { LoginDTO } from './LoginDTO';
import { LoginUseCase } from './LoginUseCase';

describe('LoginUseCase', () => {
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
  });

  test('should login a user', async () => {
    const hashService = new HashService();
    const jwtTokenService = new JwtTokenService();

    const userRequestDTO = {
      email: 'any_email@email.com',
      password: 'any_password',
    };

    userRepository.findByEmail.mockResolvedValue({
      id: 'any_id',
      firstName: 'any_firstName',
      lastName: 'any_lastName',
      email: 'any_email@email.com',
      password: await hashService.hashService('any_password'),
    });

    const sut = new LoginUseCase(userRepository, hashService, jwtTokenService);

    const output = await sut.execute(userRequestDTO);

    expect(output.getRight()).toEqual({
      user: {
        id: 'any_id',
        firstName: 'any_firstName',
        lastName: 'any_lastName',
        email: 'any_email@email.com',
      },
      token: expect.any(String),
    });
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      userRequestDTO.email
    );
  });

  test('should return an error if missing mandatory parameters', async () => {
    const hashService = new HashService();
    const jwtTokenService = new JwtTokenService();

    const sut = new LoginUseCase(userRepository, hashService, jwtTokenService);

    await expect(sut.execute({} as LoginDTO)).rejects.toThrow(
      new AppError(AppError.missingMandatoryParameters)
    );
  });

  test('should return an error if repository is not provided', async () => {
    const hashService = new HashService();
    const jwtTokenService = new JwtTokenService();

    const sut = new LoginUseCase(
      undefined as any,
      hashService,
      jwtTokenService
    );

    await expect(sut.execute({} as LoginDTO)).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });

  test('should return an Either.Left if email or password is invalid', async () => {
    const hashService = new HashService();
    const jwtTokenService = new JwtTokenService();

    const userRequestDTO = {
      email: 'any_email@email.com',
      password: 'any_password',
    };

    const sut = new LoginUseCase(userRepository, hashService, jwtTokenService);

    await expect(sut.execute(userRequestDTO)).resolves.toEqual(
      Either.left(Either.emailOrPasswordInvalid)
    );
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      userRequestDTO.email
    );
  });
});
