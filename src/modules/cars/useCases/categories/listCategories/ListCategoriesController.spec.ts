import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { BCryptHashProvider } from '@modules/accounts/providers/HashProvider/implementations/BCryptHashProvider';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
describe('List Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const bCryptHashProvider = new BCryptHashProvider();
    const password = await bCryptHashProvider.generateHash('admin');

    await connection.query(
      `INSERT INTO USERS(id, name, username, email, password, "isAdmin", driver_license)
      VALUES ('${id}', 'admin', 'superadmin', 'admin@rentx.com.br', '${password}', true, 'XXXXXXX')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list all categories', async () => {
    const responseToken = await request(app).post('/sessions').send({
      username: 'superadmin',
      password: 'admin',
    });

    const { token } = responseToken.body;

    await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get('/categories')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0].name).toEqual('Category Supertest');
  });
});
