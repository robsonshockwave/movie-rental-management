import { Router } from 'express';
import { clientRoutes } from './ClientRoutes';
import { movieRoutes } from './MovieRoutes';

const routes = Router();

routes.use('/clients', clientRoutes);
routes.use('/movies', movieRoutes);

export { routes };
