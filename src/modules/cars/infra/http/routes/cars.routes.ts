import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { ensureAdmin } from '@shared/infra/http/middleware/ensureAdmin';
import { ensureAuthenticated } from '@shared/infra/http/middleware/ensureAuthenticated';

import { CreateCarController } from '../../../useCases/cars/createCars/CreateCarController';
import { CreateCarSpecificationController } from '../../../useCases/cars/createCarSpecification/CreateCarSpecificationController';
import { ListAvailableCarsController } from '../../../useCases/cars/listAvailableCars/ListAvailableCarsController';
import { UploadCarImagesController } from '../../../useCases/cars/uploadCarImage/UploadCarImagesController';

const carsRoutes = Router();
const upload = multer(uploadConfig.multer);

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarImagesController = new UploadCarImagesController();

carsRoutes.get('/available', listAvailableCarsController.handle);

carsRoutes.use(ensureAuthenticated);
carsRoutes.use(ensureAdmin);

carsRoutes.post('/', createCarController.handle);

carsRoutes.post('/:id/specifications', createCarSpecificationController.handle);

carsRoutes.post(
  '/:id/images',
  upload.array('images'),
  uploadCarImagesController.handle,
);

export { carsRoutes };
