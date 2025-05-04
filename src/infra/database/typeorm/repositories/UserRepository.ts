import { Repository } from 'typeorm';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { UserTypeorm } from '../entities/User';
import typeormServer from '../setup';
import { User } from '../../../../domain/entities/User';

export class UserRepository implements IUserRepository {
  private ormRepository: Repository<UserTypeorm>;

  constructor() {
    this.ormRepository = typeormServer.getRepository(UserTypeorm);
  }

  async create(user: User): Promise<UserTypeorm> {
    return await this.ormRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserTypeorm | null> {
    return await this.ormRepository.findOneBy({ email });
  }
}
