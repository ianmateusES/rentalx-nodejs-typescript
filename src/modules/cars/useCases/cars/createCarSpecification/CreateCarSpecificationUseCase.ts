import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationsRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  car_id: string;
  specifications_ids: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  public async execute({ car_id, specifications_ids }: IRequest): Promise<Car> {
    const carExist = await this.carsRepository.findById(car_id);
    if (!carExist) {
      throw new AppError('Car does not exists');
    }

    const specifications = await this.specificationsRepository.findByIds(
      specifications_ids,
    );

    if (!carExist.specifications || !Array.isArray(carExist.specifications)) {
      carExist.specifications = specifications;
    } else {
      const listSpecificaitonsExist = carExist.specifications.filter(
        specification => !specifications.includes(specification),
      );

      carExist.specifications = [...listSpecificaitonsExist, ...specifications];
    }

    const newCar = await this.carsRepository.save(carExist);

    return newCar;
  }
}

export { CreateCarSpecificationUseCase };
