import { createConnection, getConnectionOptions } from 'typeorm';

interface IOptions {
  host: string;
  password: string;
}

getConnectionOptions().then(options => {
  const newOptions = options as IOptions;
  newOptions.host = process.env.DB_HOST || 'localhost';
  newOptions.password = process.env.DB_PASSWORD || 'default';
  createConnection({
    ...options,
  });
});
