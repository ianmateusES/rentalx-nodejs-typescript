import { omitBy, isNil } from 'lodash';
import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IFindAvailableDTO } from '@modules/cars/dtos/IFindAvailableDTO';
import { IUpdateAvailabilityDTO } from '@modules/cars/dtos/IUpdateAvailabilityDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { Car } from '../entities/Car';

class CarsRepository implements ICarsRepository {
  private ormRepository: Repository<Car>;

  constructor() {
    this.ormRepository = getRepository(Car);
  }

  public async create({
    name,
    description,
    license_plate,
    daily_rate,
    fine_amount,
    brand,
    category_id,
    specifications = [],
  }: ICreateCarDTO): Promise<Car> {
    const car = this.ormRepository.create({
      name,
      description,
      license_plate,
      daily_rate,
      fine_amount,
      brand,
      category_id,
      specifications,
    });

    await this.ormRepository.save(car);

    return car;
  }

  public async save(car: Car): Promise<Car> {
    const newCar = await this.ormRepository.save(car);
    return newCar;
  }

  public async findAllAvailable(data: IFindAvailableDTO): Promise<Car[]> {
    const cars = await this.ormRepository.find({
      where: Object.assign(omitBy(data, isNil), { available: true }),
    });

    return cars;
  }

  public async findById(id: string): Promise<Car> {
    const car = await this.ormRepository.findOne(id);
    return car;
  }

  public async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.ormRepository.findOne({ license_plate });
    return car;
  }

  public async findByName(name: string): Promise<Car> {
    const car = await this.ormRepository.findOne({ name });
    return car;
  }

  public async findByBrand(brand: string): Promise<Car[]> {
    const car = await this.ormRepository.find({ brand });
    return car;
  }

  public async findByCategory(category_id: string): Promise<Car[]> {
    const car = await this.ormRepository.find({ category_id });
    return car;
  }

  public async updateAvailability({
    car_id,
    availability,
  }: IUpdateAvailabilityDTO): Promise<void> {
    await this.ormRepository.update(car_id, {
      available: availability,
    });
  }
}

export { CarsRepository };
