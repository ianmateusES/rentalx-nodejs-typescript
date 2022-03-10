import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  rental_id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ rental_id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(rental_id);
    if (!rental) {
      throw new AppError('Rental does not exists!');
    }

    const car = await this.carsRepository.findById(rental.car_id);

    const minimum_daily = 1;
    const dateNow = this.dateProvider.dateNow();

    let daily = this.dateProvider.compareInDays(rental.start_date, dateNow);

    // Pelo menos uma diária
    if (daily <= 0) {
      daily = minimum_daily;
    }

    const delay = this.dateProvider.compareInDays(
      dateNow,
      rental.expected_return_date,
    );

    let total = 0;

    // Cálculo da multa
    if (delay > 0) {
      const calculate_fine = delay * car.fine_amount;
      total = calculate_fine;
    }

    // Cálculo da diária
    total += daily * car.daily_rate;

    rental.end_date = dateNow;
    rental.total = total;

    await this.rentalsRepository.save(rental);

    await this.carsRepository.updateAvailability({
      car_id: car.id,
      availability: true,
    });

    return rental;
  }
}

export { DevolutionRentalUseCase };
