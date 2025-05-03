import { Router } from 'express';
import { clientRoutes } from './ClientRoutes';
import { movieRoutes } from './MovieRoutes';
import { hireRoutes } from './HireRoutes';

const routes = Router();

routes.use('/clients', clientRoutes);
routes.use('/movies', movieRoutes);
routes.use('/hires', hireRoutes);

export { routes };
