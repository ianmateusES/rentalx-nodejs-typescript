import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from '../createCars/CreateCarsUseCase';
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe('Create car specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory,
    );
  });

  it('should be able to add a new specification to the car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Audi A3',
      description: 'Carro esportivo',
      daily_rate: 140,
      license_plate: 'DEF-1234',
      fine_amount: 100,
      brand: 'Audi',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    const specification = await specificationsRepositoryInMemory.create({
      name: 'Motor',
      description: '1.5',
    });

    const carEspecification = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_ids: [specification.id],
    });

    expect(carEspecification.specifications).toEqual([specification]);
  });

  it('should not be able to add a new specification to a now-existent car', async () => {
    await expect(
      createCarSpecificationUseCase.execute({
        car_id: 'no-index',
        specifications_ids: ['5412'],
      }),
    ).rejects.toEqual(new AppError('Car does not exists'));
  });
});
