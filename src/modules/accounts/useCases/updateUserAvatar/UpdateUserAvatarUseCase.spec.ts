import { FakeStorageProvider } from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import { AppError } from '@shared/errors/AppError';

import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

let fakeStorageProvider: FakeStorageProvider;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let updateUserAvatarUseCase: UpdateUserAvatarUseCase;

describe('Update User Avatar', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(
      usersRepositoryInMemory,
      fakeStorageProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await usersRepositoryInMemory.create({
      username: 'leoMarques',
      drive_license: '112233',
      name: 'Leo Marques',
      email: 'leomarques@exemplo.com',
      password: '123456',
    });

    await updateUserAvatarUseCase.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatarUseCase.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await usersRepositoryInMemory.create({
      username: 'leoMarques',
      drive_license: '112233',
      name: 'Leo Marques',
      email: 'leomarques@exemplo.com',
      password: '123456',
    });

    await updateUserAvatarUseCase.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUserAvatarUseCase.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
