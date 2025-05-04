export interface IHashService {
  hashService(password: string): Promise<string>;
  compareService(password: string, hash: string): Promise<boolean>;
}
