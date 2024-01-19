import { type Knex } from 'knex';

const tableName = 'flight';
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    //primary_key
    table.increments('flight_id').primary();
    //secondary_key
    table.integer('departure_id').unsigned().nullable();
    table.integer('arrival_id').unsigned().nullable();
    table.integer('airline_id').unsigned().nullable();
    //data
    table.integer('transit', 10).nullable();
    table.integer('first_seat', 5).nullable();
    table.integer('business_seat', 5).nullable();
    table.integer('economy_seat', 5).nullable();
    table.string('flight_status').nullable();
    table.string('flight_number').nullable();
    table.string('iata').nullable();
    //log
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());;
    table.timestamp('updated_at').nullable();
    //linking table relationships
    table.foreign('departure_id').references('departure_id').inTable("departure");
    table.foreign('arrival_id').references('arrival_id').inTable("arrival");
    table.foreign('airline_id').references('airline_id').inTable("airline");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
