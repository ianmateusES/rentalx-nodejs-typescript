import { Router } from 'express';

import { categoriesRoutes } from './categories.routes';
import { specificationsRoutes } from './specifications.routes';

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ mensage: 'Air application' });
});

routes.use('/categories', categoriesRoutes);
routes.use('/specifications', specificationsRoutes);

export default routes;
