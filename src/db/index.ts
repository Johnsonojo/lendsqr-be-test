import dotenv from "dotenv";
import knex from "knex";
import dbConfig from "../../knexfile";

dotenv.config();

const db = knex(dbConfig[process.env.NODE_ENV || "development"]);

export default db;
