import { Knex } from 'knex';

const tableName = 'departure';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    table.increments('departure_id').primary();
    table.integer('airport_id').unsigned().nullable();
    table.string('terminal').nullable();
    table.timestamp('scheduled_time').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
    
    table.foreign('airport_id').references('airport_id').inTable("airport");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}