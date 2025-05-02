import { IMovie, Movie } from '../entities/Movie';

export interface IMovieRepository {
  create(movie: Movie): Promise<IMovie>;
  findByISAN(ISAN: string): Promise<IMovie | null>;
  findByISANorName(value: string): Promise<IMovie[] | []>;
}
