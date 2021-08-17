import dayjs from 'dayjs';

import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { RentalsRepositoryInMemory } from '../../repositories/in-memory/RentalsRepositoryInMemory';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      carsRepositoryInMemory,
      usersRepositoryInMemory,
      dayjsDateProvider,
    );
  });

  it('should be able to create a new rental', async () => {
    const user = await usersRepositoryInMemory.create({
      username: 'ianmateus',
      email: 'ian@gmail.com',
      password: '123456',
      name: 'Ian Mateus',
      drive_license: 'XXXXX',
    });

    const car = await carsRepositoryInMemory.create({
      name: 'Test',
      description: 'Car Test',
      daily_rate: 100,
      license_plate: 'test',
      fine_amount: 40,
      category_id: '1234',
      brand: 'brand',
    });

    const rental = await createRentalUseCase.execute({
      user_id: user.id,
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    const user = await usersRepositoryInMemory.create({
      username: 'ianmateus',
      email: 'ian@gmail.com',
      password: '123456',
      name: 'Ian Mateus',
      drive_license: 'XXXXX',
    });

    const car1 = await carsRepositoryInMemory.create({
      name: 'Test',
      description: 'Car Test',
      daily_rate: 100,
      license_plate: 'test',
      fine_amount: 40,
      category_id: '1234',
      brand: 'brand',
    });

    const car2 = await carsRepositoryInMemory.create({
      name: 'Test',
      description: 'Car Test',
      daily_rate: 100,
      license_plate: 'test',
      fine_amount: 40,
      category_id: '1234',
      brand: 'brand',
    });

    await rentalsRepositoryInMemory.create({
      car_id: car1.id,
      expected_return_date: dayAdd24Hours,
      user_id: user.id,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: user.id,
        car_id: car2.id,
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError('User with rental in progress'));
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
    const user = await usersRepositoryInMemory.create({
      username: 'ianmateus',
      email: 'ian@gmail.com',
      password: '123456',
      name: 'Ian Mateus',
      drive_license: 'XXXXX',
    });

    const car = await carsRepositoryInMemory.create({
      name: 'Test',
      description: 'Car Test',
      daily_rate: 100,
      license_plate: 'test',
      fine_amount: 40,
      category_id: '1234',
      brand: 'brand',
    });

    await rentalsRepositoryInMemory.create({
      user_id: '2054865',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: user.id,
        car_id: car.id,
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError('Car is unavailable'));
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    const user = await usersRepositoryInMemory.create({
      username: 'ianmateus',
      email: 'ian@gmail.com',
      password: '123456',
      name: 'Ian Mateus',
      drive_license: 'XXXXX',
    });

    const car = await carsRepositoryInMemory.create({
      name: 'Test',
      description: 'Car Test',
      daily_rate: 100,
      license_plate: 'test',
      fine_amount: 40,
      category_id: '1234',
      brand: 'brand',
    });

    await expect(
      createRentalUseCase.execute({
        user_id: user.id,
        car_id: car.id,
        expected_return_date: dayjs().toDate(),
      }),
    ).rejects.toEqual(new AppError('Invalid return time!'));
  });
});
