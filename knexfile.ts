import dotenv from "dotenv";
import type { Knex } from "knex";

dotenv.config();

const dbConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: process.env.DEV_DATABASE_URL,
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },

  test: {
    client: "mysql2",
    connection: process.env.TEST_DATABASE_URL,
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: "mysql2",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default dbConfig;
