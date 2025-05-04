import { UserTypeorm } from '../entities/User';
import typeormServer from '../setup';
import { UserRepository } from './UserRepository';

describe('UserRepository', () => {
  const userRepository = typeormServer.getRepository(UserTypeorm);
  const sut = new UserRepository();

  beforeEach(async () => {
    await userRepository.delete({});
  });

  const userDTO = {
    firstName: 'any_firstName',
    lastName: 'any_lastName',
    email: 'any_email',
    password: 'any_password',
  };

  test('should create a user', async () => {
    const user = await sut.create(userDTO);

    expect(user).toEqual({
      id: expect.any(String),
      ...userDTO,
    });
  });

  test('should find a user by email', async () => {
    await userRepository.save(userDTO);

    const user = await sut.findByEmail('any_email');

    expect(user).toEqual({
      id: expect.any(String),
      ...userDTO,
    });
  });

  test('should find a user by email not found', async () => {
    const user = await sut.findByEmail('any_email');

    expect(user).toBeNull();
  });
});
