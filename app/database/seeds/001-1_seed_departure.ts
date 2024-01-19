import { type Knex } from 'knex';

import { departuresData } from '../aviation_api/final/seedData';

const tableName = 'departure';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert(departuresData);
}
