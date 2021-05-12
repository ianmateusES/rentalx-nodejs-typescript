import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListSpecificationsUseCase } from './ListSpecificationsUseCase';

class ListSpecificationsController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const listSpecificationsUseCase = container.resolve(
      ListSpecificationsUseCase,
    );

    const specifications = await listSpecificationsUseCase.execute();

    return res.status(200).json(specifications);
  }
}

export { ListSpecificationsController };
