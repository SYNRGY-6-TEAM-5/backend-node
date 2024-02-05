import { Knex } from 'knex';

const tableName = 'contact_details';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    // Primary Key
    table.increments('contact_id').primary();

    // Foreign Key
    table.integer('booking_id').unsigned().notNullable();

    // Data Columns
    table.string('fullName').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();

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
