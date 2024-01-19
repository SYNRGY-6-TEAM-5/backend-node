import { Knex } from 'knex';

const tableName = 'benefit';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    // Primary Key
    table.increments('benefit_id').primary();

    // Foreign Key
    table.integer('flight_id').unsigned().nullable();

    // Data Columns
    table.string('name').nullable();
    table.string('detail').nullable();

    // Log Columns
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();

    // Foreign Key Constraint
    table.foreign('flight_id').references('flight_id').inTable('flight');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
