import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('map_ticket', (table) => {
        table.increments('map_ticket_id').primary();
        table.integer('booking_id').unsigned().nullable();
        table.integer('ticket_id').unsigned().nullable();

        // Foreign Key Constraints
        table.foreign('booking_id').references('booking_id').inTable('booking');
        table.foreign('ticket_id').references('ticket_id').inTable('ticket');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('map_ticket');
}
