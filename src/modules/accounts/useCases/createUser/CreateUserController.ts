import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUseCase } from './CreateUserUseCase';

class CreateUserController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const { email, name, username, drive_license, password } = req.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({
      email,
      name,
      username,
      drive_license,
      password,
    });

    return res.status(201).json(user);
  }
}

export { CreateUserController };
