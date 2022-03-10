import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

class AuthenticateUserController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const {
      user,
      token,
      refresh_token,
    } = await authenticateUserUseCase.execute({
      username,
      password,
    });

    return res
      .status(201)
      .json({ user: classToClass(user), token, refresh_token });
  }
}

export { AuthenticateUserController };
