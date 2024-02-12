import { Knex } from 'knex';

const tableName = 'scheduled_notification';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table: Knex.TableBuilder) => {
    table.increments('notification_id').primary();
    table.string('time');
    table.json('days'); 
    table.json('notification'); 
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
