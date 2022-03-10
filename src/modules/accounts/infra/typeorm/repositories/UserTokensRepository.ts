import { getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IUserTokensRepository } from '@modules/accounts/repositories/IUserTokensRepository';

import { UserToken } from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
      refresh_token,
      expires_date,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async save(user: UserToken): Promise<UserToken> {
    const userNew = await this.ormRepository.save(user);

    return userNew;
  }

  public async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken> {
    const userToken = await this.ormRepository.findOne({
      user_id,
      refresh_token,
    });

    return userToken;
  }

  public async findByUserId(user_id: string): Promise<UserToken> {
    const userToken = await this.ormRepository.findOne({
      user_id,
    });

    return userToken;
  }

  public async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    const userToken = await this.ormRepository.findOne({ refresh_token });

    return userToken;
  }
}

export { UserTokensRepository };
