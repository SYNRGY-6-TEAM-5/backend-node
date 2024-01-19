import { Knex } from 'knex';

const tableName = 'passanger_details';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    // Primary Key
    table.increments('passanger_id').primary();

    // Foreign Key
    table.integer('booking_id').unsigned().nullable();

    // Data Columns
    table.string('NIK').nullable();
    table.string('name').nullable();
    table.datetime('date_of_birth').nullable();
    table.boolean('vaccinated').nullable();

    // Timestamps
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();

    // Foreign Key Constraint
    table.foreign('booking_id').references('booking_id').inTable('booking');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
