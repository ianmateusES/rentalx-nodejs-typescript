import { inject, injectable } from 'tsyringe';

import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';
import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

interface IResquest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    car_id,
    images_name,
  }: IResquest): Promise<CarImage[]> {
    if (!images_name.length) {
      throw new AppError('Images not found');
    }

    const cars_image = [];
    await Promise.all(
      images_name.map(async image_name => {
        const cars = await this.carsImagesRepository.create({
          car_id,
          image_name,
        });
        await this.storageProvider.saveFile(image_name, 'cars');

        cars_image.push(cars);
      }),
    );

    return cars_image;
  }
}

export { UploadCarImagesUseCase };
