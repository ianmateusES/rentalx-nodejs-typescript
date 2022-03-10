import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { UserToken } from '@modules/accounts/infra/typeorm/entities/UserToken';

import { IUserTokensRepository } from '../IUserTokensRepository';

class UserTokensRepositoryInMemory implements IUserTokensRepository {
  userTokens: UserToken[] = [];

  public async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      expires_date,
      refresh_token,
      user_id,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async save(userToken: UserToken): Promise<UserToken> {
    const findIndex = this.userTokens.findIndex(
      findUserToken => findUserToken.id === userToken.id,
    );
    this.userTokens[findIndex] = userToken;

    return userToken;
  }

  public async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken> {
    const userToken = this.userTokens.find(
      ut => ut.user_id === user_id && ut.refresh_token && refresh_token,
    );

    return userToken;
  }

  public async findByUserId(user_id: string): Promise<UserToken> {
    const findUserToken = this.userTokens.find(
      userToken => userToken.user_id === user_id,
    );

    return findUserToken;
  }

  public async deleteById(id: string): Promise<void> {
    const userToken = this.userTokens.find(ut => ut.id === id);
    this.userTokens.splice(this.userTokens.indexOf(userToken));
  }

  public async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    const userToken = this.userTokens.find(
      ut => ut.refresh_token === refresh_token,
    );

    return userToken;
  }
}

export { UserTokensRepositoryInMemory };
