import { Movie } from '../../../domain/entities/Movie';

export interface IHttpRequestCreateMovie {
  body: Movie;
}
