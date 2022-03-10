import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

import { Rental } from '../../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({
    car_id,
    expected_return_date,
    user_id,
  }: IRequest): Promise<Rental> {
    const car = await this.carsRepository.findById(car_id);
    if (!car) {
      throw new AppError('Car not found');
    }

    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }

    // Não deve ser possível alugar caso carro esteja alugado
    const carIsUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id,
    );
    if (carIsUnavailable) {
      throw new AppError('Car is unavailable');
    }

    // Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para usuário
    const userOccupied = await this.rentalsRepository.findOpenRentalByUser(
      user_id,
    );
    if (userOccupied) {
      throw new AppError('User with rental in progress');
    }

    // O aluguel deve ter duração mínima de 24 horas
    const compare = this.dateProvider.compareInHours(
      this.dateProvider.dateNow(),
      expected_return_date,
    );
    const rentalMinDurationHours = 24;
    if (compare < rentalMinDurationHours) {
      throw new AppError('Invalid return time!');
    }

    const rental = await this.rentalsRepository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailability({
      car_id,
      availability: false,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
