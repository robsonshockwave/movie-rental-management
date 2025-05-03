import { Router } from 'express';
import { clientRoutes } from './ClientRoutes';

const routes = Router();

routes.use('/client', clientRoutes);

export { routes };
