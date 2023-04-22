import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Knex } from "knex";

dotenv.config();

const SALT_ROUNDS = 10;
const hashedPassword = bcrypt.hashSync(
  process.env.GENERAL_PASSWORD || "",
  SALT_ROUNDS
);

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      id: "ac874981-1658-4a39-86e4-3fe1e91e48be",
      first_name: "Johnson",
      last_name: "Ojo",
      email: "johnson@test.com",
      password: hashedPassword,
      phone_number: "+2348012345678",
      role: "user",
    },
    {
      id: "ef2d0d89-c523-447d-9f07-473c90726cc1",
      first_name: "Vivian",
      last_name: "Robinson",
      email: "vivian@test.com",
      password: hashedPassword,
      phone_number: "+2348012345679",
      role: "user",
    },
    {
      id: "6c21f38c-b2e4-426a-bbd1-1391bbd1ee6d",
      first_name: "Jill",
      last_name: "Adams",
      email: "jill@test.com",
      password: hashedPassword,
      phone_number: "+2348012345680",
      role: "user",
    },
  ]);
}
