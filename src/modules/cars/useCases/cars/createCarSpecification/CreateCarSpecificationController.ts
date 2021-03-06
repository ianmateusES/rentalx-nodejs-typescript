import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

class CreateCarSpecificationController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { specifications_ids } = req.body;

    const createCarSpecificationUseCase = container.resolve(
      CreateCarSpecificationUseCase,
    );

    const carSpecification = await createCarSpecificationUseCase.execute({
      car_id: id,
      specifications_ids,
    });

    return res.status(201).json(carSpecification);
  }
}

export { CreateCarSpecificationController };
