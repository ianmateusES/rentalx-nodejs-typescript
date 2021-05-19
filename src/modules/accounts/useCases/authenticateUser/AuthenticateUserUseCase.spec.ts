import { AppError } from '@shared/errors/AppError';

import { FakeHashProvider } from '../../providers/HashProvider/fakes/FakeHashProvider';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let fakeHashProvider: FakeHashProvider;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    fakeHashProvider = new FakeHashProvider();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory,
      fakeHashProvider,
    );
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUserUseCase.execute({
      name: 'Leo Marques',
      username: 'leoMarques',
      email: 'leomarques@exemplo.com',
      drive_license: '112233',
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
      drive_license: '112233',
      password: '123456',
    });

    await expect(
      authenticateUserUseCase.execute({
        username: 'leoMarques',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
