import dotenv from "dotenv";
import { Knex } from "knex";

dotenv.config();

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("wallets").del();

  // Inserts seed entries
  await knex("wallets").insert([
    {
      id: "56f78b6d-5e8a-4540-87b1-a6cf83032c66",
      currency: "NGN",
      balance: "11000.00",
      account_name: "Johnson Ojo",
      account_number: "5489499737",
      user_id: "ac874981-1658-4a39-86e4-3fe1e91e48be",
    },
    {
      id: "4eb171f2-d1ba-40d9-946a-5e17a5c9c860",
      currency: "NGN",
      balance: "10000.00",
      account_name: "Vivian Robinson",
      account_number: "4784966734",
      user_id: "ef2d0d89-c523-447d-9f07-473c90726cc1",
    },
  ]);
}
