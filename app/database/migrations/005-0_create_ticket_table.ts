import { Knex } from 'knex';

const tableName = 'ticket';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
        // Primary Key
        table.increments('ticket_id').primary();

        // Foreign Key
        table.integer('flight_id').unsigned().nullable();

        // Data Columns
        table.string('ticket_type');
        table.integer('ticket_amount');
        table.decimal('fare_amount', 10, 2);
        table.datetime('valid_until');

        // Timestamps
        table.timestamp('created_at').defaultTo(knex.fn.now()).nullable();
        table.timestamp('updated_at').nullable();

        // Foreign Key Constraint
        table.foreign('flight_id').references('flight_id').inTable('flight');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(tableName);
}