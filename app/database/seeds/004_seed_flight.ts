import { type Knex } from 'knex';

import { flightsData } from '../aviation_api/final/seedData';

const tableName = 'flight';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert(flightsData);
}
