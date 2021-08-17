import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { IFindAvailableDTO } from '../dtos/IFindAvailableDTO';
import { IUpdateAvailabilityDTO } from '../dtos/IUpdateAvailabilityDTO';
import { Car } from '../infra/typeorm/entities/Car';

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  save(car: Car): Promise<Car>;
  findAllAvailable(data: IFindAvailableDTO): Promise<Car[]>;
  findById(id: string): Promise<Car>;
  findByName(name: string): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  findByBrand(brand: string): Promise<Car[]>;
  findByCategory(category_id: string): Promise<Car[]>;
  updateAvailability(data: IUpdateAvailabilityDTO): Promise<void>;
}

export { ICarsRepository };
