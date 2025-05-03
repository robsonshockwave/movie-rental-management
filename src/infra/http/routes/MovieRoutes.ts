import { Router } from 'express';
import { CreateMovieCompose } from './composers/CreateMovieCompose';
import {
  IHttpRequestCreateMovie,
  IHttpRequestGetMovieByISANorName,
} from '../dtos/MovieHttpDTO';
import { GetMovieByISANorNameCompose } from './composers/GetMovieByISANorNameCompose';

const movieRoutes = Router();

movieRoutes.post('/', async (req, res) => {
  const httpRequest = { body: req.body };

  const { statusCode, body } = await CreateMovieCompose(
    httpRequest as IHttpRequestCreateMovie
  );

  res.status(statusCode).json(body);
});

movieRoutes.get('/', async (req, res) => {
  const httpRequest = { query: req.query };

  const { statusCode, body } = await GetMovieByISANorNameCompose(
    httpRequest as IHttpRequestGetMovieByISANorName
  );

  res.status(statusCode).json(body);
});

export { movieRoutes };
