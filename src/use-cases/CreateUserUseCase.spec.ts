import { IUserRepository } from '../domain/repositories/IUserRepository';
import { AppError } from '../shared/errors/AppError';
import { HashService } from '../shared/services/HashService';
import { JwtTokenService } from '../shared/services/JwtTokenService';
import { Either } from '../shared/utils/Either';
import { CreateUserDTO } from './CreateUserDTO';
import { CreateUserUseCase } from './CreateUserUseCase';

describe('CreateUserUseCase', () => {
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
  });

  const userRequestDTO = {
    firstName: 'any_firstName',
    lastName: 'any_lastName',
    email: 'any_email',
    password: 'any_password',
  };

  test('should create a user', async () => {
    userRepository.create.mockResolvedValue({
      id: 'any_id',
      ...userRequestDTO,
    });

    const hasService = new HashService();
    const jwtTokenService = new JwtTokenService();

    const sut = new CreateUserUseCase(
      userRepository,
      hasService,
      jwtTokenService
    );

    const output = await sut.execute(userRequestDTO);

    expect(output.getRight()).toEqual({
      user: {
        ...userRequestDTO,
        id: expect.any(String),
      },
      token: expect.any(String),
    });
    expect(userRepository.create).toHaveBeenCalledWith({
      ...userRequestDTO,
      password: expect.any(String),
    });
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });

  test('should return an error if user already exists', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 'any_id',
      ...userRequestDTO,
    });

    const hasService = new HashService();
    const jwtTokenService = new JwtTokenService();

    const sut = new CreateUserUseCase(
      userRepository,
      hasService,
      jwtTokenService
    );

    const output = await sut.execute(userRequestDTO);

    expect(output.getLeft()).toEqual(
      Either.valueAlreadyRegistered(userRequestDTO.email)
    );
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      userRequestDTO.email
    );
  });

  test('should return an error if missing mandatory parameters', async () => {
    const hasService = new HashService();
    const jwtTokenService = new JwtTokenService();

    const sut = new CreateUserUseCase(
      userRepository,
      hasService,
      jwtTokenService
    );

    await expect(sut.execute({} as CreateUserDTO)).rejects.toThrow(
      new AppError(AppError.missingMandatoryParameters)
    );
  });

  test('should return an error if repository is not provided', async () => {
    const hasService = new HashService();
    const jwtTokenService = new JwtTokenService();

    const sut = new CreateUserUseCase(
      undefined as any,
      hasService,
      jwtTokenService
    );

    await expect(sut.execute(userRequestDTO)).rejects.toThrow(
      new AppError(AppError.dependencies)
    );
  });
});
