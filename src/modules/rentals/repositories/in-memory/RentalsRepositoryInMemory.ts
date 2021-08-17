import { ICreateRentalDTO } from '../../dtos/ICreateRentalDTO';
import { Rental } from '../../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../IRentalsRepository';

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[];

  constructor() {
    this.rentals = [];
  }

  public async create({
    car_id,
    expected_return_date,
    user_id,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      car_id,
      expected_return_date,
      user_id,
      start_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.rentals.push(rental);

    return rental;
  }

  public async save(rental: Rental): Promise<Rental> {
    const findIndex = this.rentals.findIndex(
      findRental => findRental.id === rental.id,
    );
    Object.assign(rental, { updated_at: new Date() });
    this.rentals[findIndex] = rental;
    return rental;
  }

  public async findById(id: string): Promise<Rental> {
    const rental = this.rentals.find(rental => rental.id === id);
    return rental;
  }

  public async findByUserId(user_id: string): Promise<Rental[]> {
    const rental = this.rentals.filter(rental => rental.user_id === user_id);
    return rental;
  }

  public async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const rental = this.rentals.find(
      rental => rental.user_id === user_id && !rental.end_date,
    );
    return rental;
  }

  public async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const rental = this.rentals.find(
      rental => rental.car_id === car_id && !rental.end_date,
    );
    return rental;
  }
}

export { RentalsRepositoryInMemory };
