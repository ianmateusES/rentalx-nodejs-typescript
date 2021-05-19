import { AppError } from '@shared/errors/AppError';

import { FakeHashProvider } from '../../providers/HashProvider/fakes/FakeHashProvider';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from './CreateUserUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let fakeHashProvider: FakeHashProvider;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    fakeHashProvider = new FakeHashProvider();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Leo Marques',
      username: 'leoMarques',
      email: 'leomarques@exemplo.com',
      drive_license: '112233',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    await createUserUseCase.execute({
      name: 'Leo Marques',
      username: 'leoMarques',
      email: 'leomarques@exemplo.com',
      drive_license: '112233',
      password: '123456',
    });

    await expect(
      createUserUseCase.execute({
        name: 'Leo Marques',
        username: 'leoMarques',
        email: 'leomarques@exemplo.com',
        drive_license: '112233',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user with same username from another', async () => {
    await createUserUseCase.execute({
      name: 'Leo Marques',
      username: 'leoMarques',
      email: 'leomarques@exemplo.com',
      drive_license: '112233',
      password: '123456',
    });

    await expect(
      createUserUseCase.execute({
        name: 'Leo Marques 2',
        username: 'leoMarques',
        email: 'leomarques2@exemplo.com',
        drive_license: '41122334',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
