import { omitBy, isNil } from 'lodash';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IFindAvailableDTO } from '@modules/cars/dtos/IFindAvailableDTO';
import { IUpdateAvailabilityDTO } from '@modules/cars/dtos/IUpdateAvailabilityDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  private cars: Car[];

  constructor() {
    this.cars = [];
  }

  public async create({
    name,
    description,
    license_plate,
    fine_amount,
    brand,
    daily_rate,
    category_id,
    specifications = [],
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      name,
      description,
      license_plate,
      fine_amount,
      brand,
      daily_rate,
      category_id,
      specifications,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.cars.push(car);

    return car;
  }

  public async save(car: Car): Promise<Car> {
    const findIndex = this.cars.findIndex(findCar => findCar.id === car.id);
    Object.assign(car, { updated_at: new Date() });
    this.cars[findIndex] = car;
    return car;
  }

  public async findAllAvailable(data: IFindAvailableDTO): Promise<Car[]> {
    let cars = this.cars.filter(car => car.available === true);
    Object.keys(omitBy(data, isNil)).forEach(item => {
      cars = cars.filter(car => car[item] === data[item]);
    });

    return cars;
  }

  public async findById(id: string): Promise<Car> {
    const car = this.cars.find(car => car.id === id);
    return car;
  }

  public async findByName(name: string): Promise<Car> {
    const car = this.cars.find(car => car.name === name);
    return car;
  }

  public async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = this.cars.find(car => car.license_plate === license_plate);
    return car;
  }

  public async findByBrand(brand: string): Promise<Car[]> {
    const listCars = this.cars.filter(car => car.brand === brand);
    return listCars;
  }

  public async findByCategory(category_id: string): Promise<Car[]> {
    const listCars = this.cars.filter(car => car.category_id === category_id);
    return listCars;
  }

  public async updateAvailability({
    car_id,
    availability,
  }: IUpdateAvailabilityDTO): Promise<void> {
    const carIndex = this.cars.findIndex(car => car.id === car_id);
    this.cars[carIndex].available = availability;
  }
}

export { CarsRepositoryInMemory };
