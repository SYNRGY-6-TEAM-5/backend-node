import { Knex } from 'knex';

const tableName = 'passenger_addons';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    // Primary Key
    table.increments('addon_id').primary();

    // Foreign Key
    table.integer('passenger_id').unsigned().notNullable();
    table.foreign('passenger_id').references('passenger_id').inTable('passenger_details');

    // Data Columns
    table.string('trip_type', 10).notNullable();
    table.string('meal_name', 255).notNullable();
    table.decimal('meal_price', 10, 2).notNullable();
    table.string('meal_img', 255).notNullable();
    table.integer('meal_count').notNullable();
    table.string('baggage_weight', 10).notNullable();
    table.decimal('baggage_price', 10, 2).notNullable();

    // Timestamps
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
