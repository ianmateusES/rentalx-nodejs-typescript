import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadCarImagesUseCase } from './UploadCarImagesUseCase';

interface IFiles {
  filename: string;
}

class UploadCarImagesController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const images = req.files as IFiles[];

    const uploadCarImagesUseCase = container.resolve(UploadCarImagesUseCase);

    const images_name = images.map(file => file.filename);
    console.log(images_name);

    const carsImages = await uploadCarImagesUseCase.execute({
      car_id: id,
      images_name,
    });

    console.log(carsImages);

    return res.status(201).json(carsImages);
  }
}

export { UploadCarImagesController };
