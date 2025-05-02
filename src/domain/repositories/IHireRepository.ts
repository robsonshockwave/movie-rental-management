import { Hire, IHire } from '../entities/Hire';

export interface IHireRepository {
  create(hire: Hire): Promise<IHire>;
  thisMovieHiredByClient(client_id: string, movie_id: string): Promise<boolean>;
  getHireWithClientAndMovieById(id: string): Promise<IHire>;
  getPendingHires(): Promise<IHire[]>;
  returnMovie(hire_id: string, return_date: string): Promise<IHire>;
}
