import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("wallets", (table) => {
    table.uuid("id").primary().notNullable();
    table.string("currency").notNullable().defaultTo("NGN");
    table.decimal("balance", 12, 2).notNullable().defaultTo(0.0);
    table.string("account_name").notNullable();
    table.string("account_number").notNullable();
    table.string("user_id").notNullable();
    table.foreign("user_id").references("id").inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("wallets");
}
