import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { CreateCarUseCase } from '../createCars/CreateCarsUseCase';
import { ListAvailableCarsUserCase } from './ListAvailableCarsUserCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;
let listAvailableCarsUserCase: ListAvailableCarsUserCase;

describe('List cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    listAvailableCarsUserCase = new ListAvailableCarsUserCase(
      carsRepositoryInMemory,
    );
  });

  it('should be able to list all available cars', async () => {
    const car1 = await createCarUseCase.execute({
      name: 'Audi A3',
      description: 'Carro esportivo',
      daily_rate: 140,
      license_plate: 'DEF-1234',
      fine_amount: 100,
      brand: 'Audi',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    const car2 = await createCarUseCase.execute({
      name: 'Gran Coupé',
      description: 'Carro esportivo',
      daily_rate: 200,
      license_plate: 'FED-1234',
      fine_amount: 150,
      brand: 'BMW',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    const car3 = await createCarUseCase.execute({
      name: 'CLA Coupé',
      description: 'Carro esportivo',
      daily_rate: 250,
      license_plate: 'ABC-1234',
      fine_amount: 100,
      brand: 'Mercedes Benz',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    await carsRepositoryInMemory.save(
      Object.assign(car2, { available: false }),
    );

    const cars = await listAvailableCarsUserCase.execute({});

    expect(cars).toEqual([car1, car3]);
  });

  it('should be able to list all available cars by name', async () => {
    const car1 = await createCarUseCase.execute({
      name: 'Audi A3',
      description: 'Carro esportivo',
      daily_rate: 140,
      license_plate: 'DEF-1234',
      fine_amount: 100,
      brand: 'Audi',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    await createCarUseCase.execute({
      name: 'Audi A2',
      description: 'Carro esportivo',
      daily_rate: 180,
      license_plate: 'DDE-1234',
      fine_amount: 120,
      brand: 'Audi',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    await createCarUseCase.execute({
      name: 'Gran Coupé',
      description: 'Carro esportivo',
      daily_rate: 200,
      license_plate: 'FED-1234',
      fine_amount: 150,
      brand: 'BMW',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    const car3 = await createCarUseCase.execute({
      name: 'CLA Coupé',
      description: 'Carro esportivo',
      daily_rate: 250,
      license_plate: 'ABC-1234',
      fine_amount: 120,
      brand: 'Mercedes Benz',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    await carsRepositoryInMemory.save(
      Object.assign(car3, { available: false }),
    );

    const cars = await listAvailableCarsUserCase.execute({ name: 'Audi A3' });

    expect(cars).toEqual([car1]);
  });

  it('should be able to list all available cars by brand', async () => {
    const car1 = await createCarUseCase.execute({
      name: 'Audi A3',
      description: 'Carro esportivo',
      daily_rate: 140,
      license_plate: 'DEF-1234',
      fine_amount: 100,
      brand: 'Audi',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    const car2 = await createCarUseCase.execute({
      name: 'Audi A2',
      description: 'Carro esportivo',
      daily_rate: 180,
      license_plate: 'DDE-1234',
      fine_amount: 120,
      brand: 'Audi',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    const car3 = await createCarUseCase.execute({
      name: 'Gran Coupé',
      description: 'Carro esportivo',
      daily_rate: 200,
      license_plate: 'FED-1234',
      fine_amount: 150,
      brand: 'BMW',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    await createCarUseCase.execute({
      name: 'CLA Coupé',
      description: 'Carro esportivo',
      daily_rate: 250,
      license_plate: 'ABC-1234',
      fine_amount: 120,
      brand: 'Mercedes Benz',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    await carsRepositoryInMemory.save(
      Object.assign(car3, { available: false }),
    );

    const cars = await listAvailableCarsUserCase.execute({ brand: 'Audi' });

    expect(cars).toEqual([car1, car2]);
  });

  it('should be able to list all available cars by category', async () => {
    const car1 = await createCarUseCase.execute({
      name: 'Audi A3',
      description: 'Carro esportivo',
      daily_rate: 140,
      license_plate: 'DEF-1234',
      fine_amount: 100,
      brand: 'Audi',
      category_id: '0aa17e85-c78d-45f8-9194-f9695e965c1c',
    });

    await createCarUseCase.execute({
      name: 'Audi A2',
      description: 'Carro esportivo',
      daily_rate: 180,
      license_plate: 'DDE-1234',
      fine_amount: 120,
      brand: 'Audi',
      category_id: 'b10efc82-720c-4cdf-8509-0b939091c21b',
    });

    const car3 = await createCarUseCase.execute({
      name: 'Gran Coupé',
      description: 'Carro esportivo',
      daily_rate: 200,
      license_plate: 'FED-1234',
      fine_amount: 150,
      brand: 'BMW',
      category_id: '0aa17e85-c78d-45f8-9194-f9695e965c1c',
    });

    const car4 = await createCarUseCase.execute({
      name: 'CLA Coupé',
      description: 'Carro esportivo',
      daily_rate: 250,
      license_plate: 'ABC-1234',
      fine_amount: 120,
      brand: 'Mercedes Benz',
      category_id: '0aa17e85-c78d-45f8-9194-f9695e965c1c',
    });

    await carsRepositoryInMemory.save(
      Object.assign(car4, { available: false }),
    );

    const cars = await listAvailableCarsUserCase.execute({
      category_id: '0aa17e85-c78d-45f8-9194-f9695e965c1c',
    });

    expect(cars).toEqual([car1, car3]);
  });
});
