import { Router } from 'express';
import { CreateMovieCompose } from './composers/CreateMovieCompose';
import { IHttpRequestCreateMovie } from '../dtos/MovieHttpDTO';

const movieRoutes = Router();

movieRoutes.post('/', async (req, res) => {
  const httpRequest = { body: req.body };

  const { statusCode, body } = await CreateMovieCompose(
    httpRequest as IHttpRequestCreateMovie
  );

  res.status(statusCode).json(body);
});

export { movieRoutes };
