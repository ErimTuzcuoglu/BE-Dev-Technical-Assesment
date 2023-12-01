import { DataSourceOptions } from 'typeorm';
const path = require('path');

export default () => {
  const {
    DB_HOST = 'localhost',
    DB_PORT,
    DB_USERNAME = 'postgres',
    DB_PASSWORD = 'password',
    DB_NAME = 'scraper',
  } = process.env;
  const migrationsDir = path.join(__dirname, '/migrations');
  const entitiesDir = path.join(`${__dirname}/../**/*.entity{.ts,.js}`);

  return {
    type: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT) || 5432,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    entities: [entitiesDir],
    logging: true,
    synchronize: true,
    migrationsRun: false,
    migrations: [`${migrationsDir}/*{.ts,.js}`],
    cli: {
      migrationsDir: migrationsDir,
    },
    database: DB_NAME,
  } as DataSourceOptions;
};