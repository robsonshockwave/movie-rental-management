import { Movie } from '../../../domain/entities/Movie';

export interface IHttpRequestCreateMovie {
  body: Movie;
}

export interface IHttpRequestGetMovieByISANorName {
  query: {
    value: string;
  };
}
