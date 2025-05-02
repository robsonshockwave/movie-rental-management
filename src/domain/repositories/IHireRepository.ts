import { IClient } from '../entities/Client';
import { Hire, IHire } from '../entities/Hire';
import { IMovie, Movie } from '../entities/Movie';

export interface IHireRepository {
  create(hire: Hire): Promise<IHire>;
  thisMovieHiredByClient(client_id: string, movie_id: string): Promise<boolean>;
  getHireWithClientAndMovieById(id: string): Promise<{
    hire: IHire;
    client: IClient;
    movie: IMovie;
  }>;
}
