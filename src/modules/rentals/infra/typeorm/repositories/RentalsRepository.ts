import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '../../../dtos/ICreateRentalDTO';
import { IRentalsRepository } from '../../../repositories/IRentalsRepository';
import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private ormRepository: Repository<Rental>;

  constructor() {
    this.ormRepository = getRepository(Rental);
  }

  public async create({
    car_id,
    user_id,
    end_date,
    expected_return_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.ormRepository.create({
      car_id,
      expected_return_date,
      user_id,
      end_date,
      total,
    });

    await this.ormRepository.save(rental);

    return rental;
  }

  public async save(rental: Rental): Promise<Rental> {
    const newRental = await this.ormRepository.save(rental);
    return newRental;
  }

  public async findById(id: string): Promise<Rental> {
    const rental = await this.ormRepository.findOne(id);
    return rental;
  }

  public async findByUserId(user_id: string): Promise<Rental[]> {
    const rental = await this.ormRepository.find({
      where: { user_id },
      relations: ['car'],
    });

    return rental;
  }

  public async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const openedRentalWithUser = await this.ormRepository.findOne({
      where: { user_id, end_date: null },
    });
    return openedRentalWithUser;
  }

  public async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const openedRentalWithCar = await this.ormRepository.findOne({
      where: { car_id, end_date: null },
    });
    return openedRentalWithCar;
  }
}

export { RentalsRepository };
