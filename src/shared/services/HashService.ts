import bcrypt from 'bcryptjs';

export class HashService {
  async hashService(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compareService(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
