import { Router } from 'express';
import { CreateMovieCompose } from './composers/CreateMovieCompose';
import {
  IHttpRequestCreateMovie,
  IHttpRequestGetMovieByISANorName,
} from '../dtos/MovieHttpDTO';
import { GetMovieByISANorNameCompose } from './composers/GetMovieByISANorNameCompose';
import { authenticate } from '../middlewares/authenticate';

const movieRoutes = Router();

movieRoutes.post('/', authenticate, async (req, res) => {
  const httpRequest = { body: req.body };

  const { statusCode, body } = await CreateMovieCompose(
    httpRequest as IHttpRequestCreateMovie
  );

  res.status(statusCode).json(body);
});

movieRoutes.get('/', authenticate, async (req, res) => {
  const httpRequest = { query: req.query };

  const { statusCode, body } = await GetMovieByISANorNameCompose(
    httpRequest as IHttpRequestGetMovieByISANorName
  );

  res.status(statusCode).json(body);
});

export { movieRoutes };
