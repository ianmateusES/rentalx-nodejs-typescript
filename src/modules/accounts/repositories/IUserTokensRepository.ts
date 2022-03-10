import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { UserToken } from '../infra/typeorm/entities/UserToken';

interface IUserTokensRepository {
  create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserToken>;
  save(userToken: UserToken): Promise<UserToken>;
  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken>;
  findByUserId(user_id: string): Promise<UserToken>;
  deleteById(id: string): Promise<void>;
  findByRefreshToken(refresh_token: string): Promise<UserToken>;
}

export { IUserTokensRepository };
