import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListAvailableCarsUserCase } from './ListAvailableCarsUserCase';

class ListAvailableCarsController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const { name, brand, category_id } = req.query;

    const listAvailableCarsUserCase = container.resolve(
      ListAvailableCarsUserCase,
    );

    const cars = await listAvailableCarsUserCase.execute({
      name: name as string,
      brand: brand as string,
      category_id: category_id as string,
    });

    return res.json(cars);
  }
}

export { ListAvailableCarsController };
