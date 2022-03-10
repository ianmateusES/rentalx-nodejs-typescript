import { v4 as uuidV4 } from 'uuid';

import { BCryptHashProvider } from '@modules/accounts/providers/HashProvider/implementations/BCryptHashProvider';

import createConnection from '../index';

const bCryptHashProvider = new BCryptHashProvider();

async function create() {
  const connection = await createConnection();
  const id = uuidV4();
  const password = await bCryptHashProvider.generateHash('admin');

  await connection.query(
    `INSERT INTO USERS(id, name, username, email, password, "isAdmin", driver_license)
    VALUES ('${id}', 'admin', 'superadmin', 'admin@rentx.com.br', '${password}', true, 'XXXXXXX')`,
  );

  await connection.close();
}

create().then(() => console.log('Admin created'));
