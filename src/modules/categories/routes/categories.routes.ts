import { Router } from 'express';

import CategoriesController from '../controllers/CategoriesController';

const categoriesRoutes = Router();
const categoriesController = new CategoriesController();

categoriesRoutes.post('/', categoriesController.create);

export default categoriesRoutes;
