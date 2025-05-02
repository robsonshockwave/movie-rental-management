import { IClient } from '../entities/Client';
import { Hire, IHire } from '../entities/Hire';
import { IMovie, Movie } from '../entities/Movie';

interface IHireWithClientAndMovie extends IHire {
  client: IClient;
  movie: IMovie;
}

export interface IHireRepository {
  create(hire: Hire): Promise<IHire>;
  thisMovieHiredByClient(client_id: string, movie_id: string): Promise<boolean>;
  getHireWithClientAndMovieById(id: string): Promise<IHireWithClientAndMovie>;
  getPendingHires(): Promise<IHireWithClientAndMovie[]>;
  returnMovie(hire_id: string, return_date: string): Promise<IHire>;
}
