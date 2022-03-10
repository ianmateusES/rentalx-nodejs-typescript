import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import { IUserTokensRepository } from '@modules/accounts/repositories/IUserTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

import { User } from '../../infra/typeorm/entities/User';
import { IHashProvider } from '../../providers/HashProvider/models/IHashProvider';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  username: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ username, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByUserName(username);
    if (!user) {
      throw new AppError('Incorrect username/password combination', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );
    if (!passwordMatched) {
      throw new AppError('Incorrect username/password combination', 401);
    }

    const {
      secret,
      expiresIn,
      secret_refresh_token,
      expires_in_refresh_token,
      expires_refresh_token_days,
    } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    const refresh_token = sign({ username }, secret_refresh_token, {
      subject: user.id,
      expiresIn: expires_in_refresh_token,
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_refresh_token_days,
      this.dateProvider.dateNow(),
    );

    // const userToken = await this.userTokensRepository.findByUserId(user.id);
    // if (!userToken) {
    await this.userTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date: refresh_token_expires_date,
    });
    // } else {
    //   Object.assign(userToken, {
    //     refresh_token,
    //     expires_date: refresh_token_expires_date,
    //   });
    //   await this.userTokensRepository.save(userToken);
    // }

    return {
      user,
      token,
      refresh_token,
    };
  }
}

export { AuthenticateUserUseCase };
