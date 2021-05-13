import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../../../config/upload';
import ensureAuthenticated from '../../../shared/middleware/ensureAuthenticated';
import { CreateCategoryController } from '../useCases/categories/createCategory/CreateCategoryController';
import { ImportCategoryController } from '../useCases/categories/importCategory/ImportCategoryController';
import { ListCategoriesController } from '../useCases/categories/listCategories/ListCategoriesController';

const categoriesRoutes = Router();
const upload = multer(uploadConfig.multer);

const createCategoryController = new CreateCategoryController();
const importCategoryController = new ImportCategoryController();
const listCategoriesController = new ListCategoriesController();

categoriesRoutes.use(ensureAuthenticated);
categoriesRoutes.post('/', createCategoryController.handle);
categoriesRoutes.post(
  '/import',
  upload.single('file'),
  importCategoryController.handle,
);
categoriesRoutes.get('/', listCategoriesController.handle);

export { categoriesRoutes };
