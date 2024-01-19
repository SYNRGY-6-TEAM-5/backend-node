import { type Knex } from 'knex';

import { arrivalsData } from '../aviation_api/final/seedData';

const tableName = 'arrival';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert(arrivalsData);
}
