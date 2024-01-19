import { Knex } from 'knex';

const tableName = 'booking';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    // Primary Key
    table.increments('booking_id').primary();

    // Foreign Keys
    table.uuid('user_id').unsigned().nullable();

    // Data Columns
    table.enum('trip_type', ['one-way', 'roundtrip', 'multi']).defaultTo('one-way').nullable();
    table.integer('total_passenger').nullable();
    table.datetime('expired_time').nullable();
    table.decimal('total_amount', 10, 2).nullable();
    table.boolean('full_protection').nullable();
    table.boolean('bag_insurance').nullable();
    table.boolean('flight_delay').nullable();
    table.string('payment_method').nullable();
    table.string('status').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).nullable();
    table.timestamp('updated_at').nullable();

    // Foreign Key Constraints
    table.foreign('user_id').references('user_id').inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
