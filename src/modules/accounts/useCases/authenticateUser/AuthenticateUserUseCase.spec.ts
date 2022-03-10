import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { HashProviderInMemory } from '../../providers/HashProvider/in-memory/HashProviderInMemory';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { UserTokensRepositoryInMemory } from '../../repositories/in-memory/UserTokensRepositoryInMemory';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let userTokensRepositoryInMemory: UserTokensRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let hashProviderInMemory: HashProviderInMemory;
let createUserUseCase: CreateUserUseCase;
let dayjsDateProvider: DayjsDateProvider;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    userTokensRepositoryInMemory = new UserTokensRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory,
      hashProviderInMemory,
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      hashProviderInMemory,
      dayjsDateProvider,
      userTokensRepositoryInMemory,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUserUseCase.execute({
      name: 'Leo Marques',
      username: 'leoMarques',
      email: 'leomarques@exemplo.com',
      driver_license: '112233',
      password: '123456',
    });

    const response = await authenticateUserUseCase.execute({
      username: 'leoMarques',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        username: 'leoMarques',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUserUseCase.execute({
      name: 'Leo Marques',
      username: 'leoMarques',
      email: 'leomarques@exemplo.com',
      driver_license: '112233',
      password: '123456',
    });

    await expect(
      authenticateUserUseCase.execute({
        username: 'leoMarques',
        password: 'wrong-password',
      }),
    ).rejects.toEqual(
      new AppError('Incorrect username/password combination', 401),
    );
  });
});
