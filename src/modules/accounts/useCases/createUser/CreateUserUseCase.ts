import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { User } from '../../infra/typeorm/entities/User';
import { IHashProvider } from '../../providers/HashProvider/models/IHashProvider';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  name: string;
  username: string;
  email: string;
  drive_license: string;
  password: string;
}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    username,
    email,
    drive_license,
    password,
  }: IRequest): Promise<User> {
    const userEmailAlreadyExist = await this.userRepository.findByEmail(email);
    if (userEmailAlreadyExist) {
      throw new AppError('Email already used', 401);
    }

    const userUserNameAlreadyExist = await this.userRepository.findByUserName(
      username,
    );
    if (userUserNameAlreadyExist) {
      throw new AppError('Username already used', 401);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.userRepository.create({
      name,
      username,
      email,
      drive_license,
      password: hashedPassword,
    });

    return user;
  }
}

export { CreateUserUseCase };
