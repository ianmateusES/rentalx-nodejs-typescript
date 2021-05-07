import { Router } from 'express';

import CategoriesController from '../controllers/CategoriesController';

const categoriesRoutes = Router();
const categoriesController = new CategoriesController();

categoriesRoutes.post('/', categoriesController.create);
categoriesRoutes.get('/', categoriesController.index);

export default categoriesRoutes;
