import { Connection, createConnection, getConnectionOptions } from 'typeorm';

// interface IOptions {
//   host: string;
//   password: string;
// }

// getConnectionOptions().then(options => {
//   const newOptions = options as IOptions;
//   newOptions.host = process.env.DB_HOST || 'localhost';
//   newOptions.password = process.env.DB_PASSWORD || 'default';
//   createConnection({
//     ...options,
//   });
// });

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.DB_HOST || 'localhost',
      password: process.env.DB_PASSWORD || 'default',
    }),
  );
};
