import { type Knex } from 'knex';

import { airportsData } from '../aviation_api/final/seedData';

const tableName = 'airport';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert(airportsData);
}
