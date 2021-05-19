import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { CreateCategoryController } from '@modules/cars/useCases/categories/createCategory/CreateCategoryController';
import { ImportCategoryController } from '@modules/cars/useCases/categories/importCategory/ImportCategoryController';
import { ListCategoriesController } from '@modules/cars/useCases/categories/listCategories/ListCategoriesController';
import ensureAuthenticated from '@shared/infra/http/middleware/ensureAuthenticated';

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
