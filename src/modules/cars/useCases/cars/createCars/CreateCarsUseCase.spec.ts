import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarsUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;

describe('Create car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Name Brand',
      category_id: 'category',
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a new car with exists license place ', async () => {
    await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'License place equal',
      fine_amount: 60,
      brand: 'Name Brand',
      category_id: 'category',
    });

    await expect(
      createCarUseCase.execute({
        name: 'Name Car 2',
        description: 'Description Car 2',
        daily_rate: 150,
        license_plate: 'License place equal',
        fine_amount: 80,
        brand: 'Name Brand',
        category_id: 'category 2',
      }),
    ).rejects.toEqual(new AppError('Car already exists'));
  });

  it('should not be able to create a car with available true by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Name Brand',
      category_id: 'category',
    });

    expect(car.available).toBe(true);
  });
});
