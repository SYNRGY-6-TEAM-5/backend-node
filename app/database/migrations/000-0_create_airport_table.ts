import { Knex } from 'knex';

const tableName = 'airport';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    table.increments('airport_id').primary();
    table.string('airport_name').nullable();
    table.string('iata_code').nullable();
    table.string('gmt').nullable();
    table.string('city_name').nullable();
    table.string('city_iata_code').nullable();
    table.string('country_name').nullable();
    table.string('country_iso_code').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
