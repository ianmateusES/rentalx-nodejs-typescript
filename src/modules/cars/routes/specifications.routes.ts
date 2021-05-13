import { Router } from 'express';

import ensureAuthenticated from '../../../shared/middleware/ensureAuthenticated';
import { CreateSpecificationController } from '../useCases/specifications/createSpecification/CreateSpecificationController';
import { ListSpecificationsController } from '../useCases/specifications/listSpecifications/ListSpecificationsController';

const specificationsRoutes = Router();

const createSpecificationController = new CreateSpecificationController();
const listSpecificationsController = new ListSpecificationsController();

specificationsRoutes.use(ensureAuthenticated);
specificationsRoutes.post('/', createSpecificationController.handle);
specificationsRoutes.get('/', listSpecificationsController.handle);

export { specificationsRoutes };
