import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { ensureAuthenticated } from '@shared/infra/http/middleware/ensureAuthenticated';

import { CreateUserController } from '../useCases/createUser/CreateUserController';
import { UpdateUserAvatarController } from '../useCases/updateUserAvatar/UpdateUserAvatarController';

const usersRoutes = Router();
const uploadAvatar = multer(uploadConfig.multer);

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();

usersRoutes.post('/', createUserController.handle);

usersRoutes.use(ensureAuthenticated);

usersRoutes.patch(
  '/avatar',
  uploadAvatar.single('avatar'),
  updateUserAvatarController.handle,
);

export { usersRoutes };
