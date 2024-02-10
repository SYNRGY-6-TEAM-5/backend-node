import { Knex } from 'knex';

const tableName = 'saved_passenger_details';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    // Primary Key
    table.increments('saved_passenger_id').primary();

    // Foreign Key
    table.uuid('user_id').unsigned().notNullable();

    // Data Columns
    table.string('NIK').nullable();
    table.string('name').nullable();
    table.datetime('date_of_birth').nullable();
    table.boolean('vaccinated').nullable();

    // Timestamps
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();

    // Foreign Key Constraint
    table.foreign('user_id').references('user_id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
