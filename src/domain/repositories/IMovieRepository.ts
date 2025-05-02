import { Movie } from '../entities/Movie';

export interface IMovieRepository {
  create(movie: Movie): Promise<Movie>;
  findByISAN(ISAN: string): Promise<Movie | []>;
  findByISANorName(value: string): Promise<Movie | []>;
}
