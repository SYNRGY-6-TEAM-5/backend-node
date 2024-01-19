import knex, { type Knex } from 'knex';

class Database {
  private static instance: Database;
  private readonly _db: Knex;

  constructor(config: any) {
    this._db = knex(config);
  }

  public static getInstance(config: any): Database {
    if (!Database.instance) {
      Database.instance = new Database(config);
    }
    return Database.instance;
  }

  get db(): Knex {
    return this._db;
  }
}

let connectionURL;

if (process.env.NODE_ENV === 'production') {
  connectionURL = process.env.DATABASE_URL_PROD;
} else if (process.env.NODE_ENV === 'development') {
  connectionURL = process.env.DATABASE_URL;
} else {
  throw new Error('NODE_ENV not set or invalid');
}

if (!connectionURL) {
  throw new Error('DATABASE_URL environment variable not found');
}

const config = {
  client: 'postgresql',
  connection: connectionURL
};

const database = Database.getInstance(config).db;

export default database;
