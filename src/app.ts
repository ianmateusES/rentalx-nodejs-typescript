import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';

import { AppError } from './errors/AppError';
import routes from './routes';
import swaggerFile from './swagger.json';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.messege,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Insternal server error',
  });
});

export default app;
