import { Router } from 'express';

import { ensureAuthenticated } from '@shared/infra/http/middleware/ensureAuthenticated';

import { CreateRentalController } from '../../../useCases/createRental/CreateRentalController';
import { DevolutionRentalController } from '../../../useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsByUserController } from '../../../useCases/listRentalsByUser/ListRentalsByUserController';

const rentalRoutes = Router();

const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const listRentalsByUser = new ListRentalsByUserController();

rentalRoutes.post('/', ensureAuthenticated, createRentalController.handle);

rentalRoutes.use(ensureAuthenticated);
rentalRoutes.post('/devolution/:id', devolutionRentalController.handle);

rentalRoutes.get('/user', listRentalsByUser.handle);

export { rentalRoutes };
