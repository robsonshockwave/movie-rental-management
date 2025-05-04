import { Router } from 'express';
import { clientRoutes } from './ClientRoutes';
import { movieRoutes } from './MovieRoutes';
import { hireRoutes } from './HireRoutes';
import { userRoutes } from './UserRoutes';
import { loginRoutes } from './LoginRoutes';

const routes = Router();

routes.use('/clients', clientRoutes);
routes.use('/movies', movieRoutes);
routes.use('/hires', hireRoutes);
routes.use('/users', userRoutes);
routes.use('/login', loginRoutes);

export { routes };
