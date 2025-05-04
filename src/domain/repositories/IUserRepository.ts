import { IUser, User } from '../entities/User';

export interface IUserRepository {
  create(user: User): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
}
