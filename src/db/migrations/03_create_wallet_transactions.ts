import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("walletTransactions", (table) => {
    table.uuid("id").primary().notNullable();
    table.string("amount").notNullable();
    table.string("currency").notNullable();
    table.string("transaction_type").notNullable();
    table.string("transaction_ref").notNullable();
    table.string("wallet_id").notNullable();
    table.string("user_id").notNullable();
    table.string("receiver_id").notNullable();
    table.string("receiver_wallet_id").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("walletTransactions");
}
