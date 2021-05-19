import { Router } from 'express';

import { authenticateRoutes } from '@modules/accounts/routes/authenticate.routes';
import { usersRoutes } from '@modules/accounts/routes/users.routes';
import { categoriesRoutes } from '@modules/cars/infra/http/routes/categories.routes';
import { specificationsRoutes } from '@modules/cars/infra/http/routes/specifications.routes';

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ mensage: 'Air application' });
});

routes.use('/categories', categoriesRoutes);
routes.use('/specifications', specificationsRoutes);
routes.use('/users', usersRoutes);
routes.use(authenticateRoutes);

export { routes };
