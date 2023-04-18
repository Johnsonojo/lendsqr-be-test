import { Request, Response } from "express";
import knex from "knex";
import { v4 as uuidv4 } from "uuid";
import dbConfig from "../../../knexfile";
import { generateAccessToken, hashPassword } from "../../helpers/util";

const db = knex(dbConfig[process.env.NODE_ENV || "development"]);

class AuthController {
  static signup = async (req: Request, res: Response) => {
    const { first_name, last_name, email, password, phone_number } = req.body;
    try {
      const user = await db("users").where({ email }).first();
      if (user) {
        return res.status(409).json({
          message: "User already exists",
          status: "failure",
        });
      }
      const hashedPassword = hashPassword(password);
      const newUser = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone_number,
      };
      // insert new user into database
      await db("users").insert(newUser);

      // retrieve newly created user from database and exclude password
      const newlyCreatedUser = await db("users")
        .where({ email })
        .select(
          "id",
          "email",
          "first_name",
          "last_name",
          "phone_number",
          "role"
        )
        .first();

      const payload = {
        userId: newlyCreatedUser.id,
        role: newlyCreatedUser.role,
      };
      const accessToken = await generateAccessToken(payload);

      res.status(201).json({
        message: "User registered successfully",
        status: "success",
        data: { newlyCreatedUser, accessToken },
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
        status: "failure",
      });
    }
  };
}

export default AuthController;
