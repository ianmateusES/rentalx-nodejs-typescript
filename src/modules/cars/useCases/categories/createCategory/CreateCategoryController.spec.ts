import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { BCryptHashProvider } from '@modules/accounts/providers/HashProvider/implementations/BCryptHashProvider';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const bCryptHashProvider = new BCryptHashProvider();
    const password = await bCryptHashProvider.generateHash('admin');

    await connection.query(
      `INSERT INTO USERS(id, name, username, email, password, "isAdmin", driver_license)
        values('${id}', 'admin', 'superadmin', 'admin@rentx.com.br', '${password}', true, 'XXXXXX')
      `,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new category', async () => {
    const responseToken = await request(app).post('/sessions').send({
      username: 'superadmin',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a new category with name exists', async () => {
    const responseToken = await request(app).post('/sessions').send({
      username: 'superadmin',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
