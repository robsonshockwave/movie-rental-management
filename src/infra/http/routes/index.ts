import { Router } from 'express';
import { clientRoutes } from './ClientRoutes';

const routes = Router();

routes.use('/clients', clientRoutes);

export { routes };
