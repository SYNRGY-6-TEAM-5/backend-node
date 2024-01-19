import { Knex } from 'knex';

const tableName = 'airline';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    table.increments('airline_id').primary();
    table.string('name').nullable();
    table.string('iata').nullable();
    table.string('image').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());;
    table.timestamp('updated_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
