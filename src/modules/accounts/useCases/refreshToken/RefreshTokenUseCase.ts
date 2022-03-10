import { verify, sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';
import { IUserTokensRepository } from '@modules/accounts/repositories/IUserTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  username: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  public async execute(token: string): Promise<ITokenResponse> {
    const {
      secret,
      expiresIn,
      secret_refresh_token,
      expires_in_refresh_token,
      expires_refresh_token_days,
    } = authConfig.jwt;

    const { username, sub: user_id } = verify(
      token,
      secret_refresh_token,
    ) as IPayload;

    const userToken = await this.userTokensRepository.findByUserIdAndRefreshToken(
      user_id,
      token,
    );
    if (!userToken) {
      throw new AppError('Refresh Token does not exists!');
    }

    const refresh_token = sign({ username }, secret_refresh_token, {
      subject: user_id,
      expiresIn: expires_in_refresh_token,
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_refresh_token_days,
      this.dateProvider.dateNow(),
    );

    Object.assign(userToken, {
      refresh_token,
      expires_date: refresh_token_expires_date,
    });

    await this.userTokensRepository.save(userToken);

    const newToken = sign({}, secret, {
      subject: user_id,
      expiresIn,
    });

    return {
      refresh_token,
      token: newToken,
    };
  }
}

export { RefreshTokenUseCase };
