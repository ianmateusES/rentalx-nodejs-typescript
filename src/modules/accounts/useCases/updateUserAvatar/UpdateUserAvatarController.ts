import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

class UpdateUserAvatarController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const updateUserAvatarUseCase = container.resolve(UpdateUserAvatarUseCase);

    const user = await updateUserAvatarUseCase.execute({
      user_id: req.user.id,
      avatarFilename: req.file.filename,
    });

    return res.status(201).json(classToClass(user));
  }
}

export { UpdateUserAvatarController };
