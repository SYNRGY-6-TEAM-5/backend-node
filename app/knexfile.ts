import path from 'path';
import dotenv from 'dotenv';
// require('dotenv').config({path: 'path_to_env_file'});
dotenv.config({path: '../.env'});
import { type Knex } from 'knex';

const config: Record<string, Knex.Config> = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds')
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL_PROD,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds')
    }
  }
};

export default config;
