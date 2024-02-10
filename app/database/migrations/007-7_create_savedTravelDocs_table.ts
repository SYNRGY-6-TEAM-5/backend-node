import { Knex } from 'knex';

const tableName = 'saved_travel_docs';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    // Primary Key
    table.increments('saved_travel_docs_id').primary();

    // Foreign Key
    table.integer('saved_passenger_id').unsigned().nullable();

    // Data Columns
    table.string('doc_type', 255).nullable();
    table.string('nationality', 255).nullable();
    table.string('doc_number', 255).nullable();
    table.datetime('expired_date').nullable();
    table.string('file', 255).nullable();
    table.boolean('valid').nullable();

    // Timestamps
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();

    // Foreign Key Constraint
    table.foreign('saved_passenger_id').references('saved_passenger_id').inTable('saved_passenger_details');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
