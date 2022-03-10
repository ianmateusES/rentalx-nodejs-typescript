import { Router } from 'express';

import { AuthenticateUserController } from '../../../useCases/authenticateUser/AuthenticateUserController';
import { RefreshTokenController } from '../../../useCases/refreshToken/RefreshTokenController';

const authenticateRoutes = Router();
const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

authenticateRoutes.post('/sessions', authenticateUserController.handle);
authenticateRoutes.post('/refresh-token', refreshTokenController.handle);

export { authenticateRoutes };
