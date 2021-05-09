import { Request, Response } from 'express';

import { ListSpecificationsUseCase } from './ListSpecificationsUseCase';

class ListSpecificationsController {
  constructor(private listSpecificationsUseCase: ListSpecificationsUseCase) {}

  handle(req: Request, res: Response): Response {
    const specifications = this.listSpecificationsUseCase.execute();

    return res.status(201).json(specifications);
  }
}

export { ListSpecificationsController };
