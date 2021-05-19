import { v4 as uuidV4 } from 'uuid';

import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { User } from '../../infra/typeorm/entities/User';
import { IUsersRepository } from '../IUsersRepository';

class UsersRepositoryInMemory implements IUsersRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  public async findById(id: string): Promise<User> {
    const user = this.users.find(user => user.id === id);

    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = this.users.find(user => user.email === email);

    return user;
  }

  public async findByUserName(username: string): Promise<User> {
    const user = this.users.find(user => user.username === username);

    return user;
  }

  public async create({
    name,
    email,
    username,
    drive_license,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: uuidV4(),
      name,
      email,
      username,
      drive_license,
      password,
    });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(finduser => finduser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}

export { UsersRepositoryInMemory };
