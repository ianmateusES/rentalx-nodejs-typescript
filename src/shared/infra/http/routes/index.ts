import { Router } from 'express';

import {
  authenticateRoutes,
  passwordRoutes,
  usersRoutes,
} from '@modules/accounts/infra/http/routes';
import {
  carsRoutes,
  categoriesRoutes,
  specificationsRoutes,
} from '@modules/cars/infra/http/routes';
import { rentalRoutes } from '@modules/rentals/infra/http/routes';

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ mensage: 'Air application' });
});

routes.use('/categories', categoriesRoutes);
routes.use('/specifications', specificationsRoutes);
routes.use('/users', usersRoutes);
routes.use('/password', passwordRoutes);
routes.use('/cars', carsRoutes);
routes.use('/rentals', rentalRoutes);
routes.use(authenticateRoutes);

export { routes };
