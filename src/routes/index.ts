import { Router } from 'express';

import categoriesRouter from '../modules/categories/routes/categories.routes';

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ mensage: 'Air application' });
});

routes.use('/categories', categoriesRouter);

export default routes;
