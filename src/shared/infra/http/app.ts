import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';

import '@shared/container';
import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';

import uploadConfig from '@config/upload';
import createConnection from '@shared/infra/typeorm';

import { AppError } from '../../errors/AppError';
import { routes } from './routes';
import swaggerFile from './swagger.json';

createConnection();

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/avatar', express.static(`${uploadConfig.uploadsFolder}/avatar`));
app.use('/cars', express.static(`${uploadConfig.uploadsFolder}/cars`));
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export { app };
