import { type Knex } from 'knex';

const tableName = 'role';
const usersData = [
  {
    role_name: 'USER'
  },
  {
    role_name: 'ADMIN'
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert(usersData);
}
