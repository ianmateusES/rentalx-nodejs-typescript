import { inject, injectable } from 'tsyringe';

import { IHashProvider } from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUserTokensRepository } from '@modules/accounts/repositories/IUserTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordUserUseCase {
  constructor(
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByRefreshToken(token);
    if (!userToken) {
      throw new AppError('Token invalid!');
    }

    if (
      this.dateProvider.checkIsBefore(
        userToken.expires_date,
        this.dateProvider.dateNow(),
      )
    ) {
      throw new AppError('Token expired!');
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    user.password = await this.hashProvider.generateHash(password);
    await this.usersRepository.save(user);

    await this.userTokensRepository.deleteById(userToken.id);
  }
}

export { ResetPasswordUserUseCase };
