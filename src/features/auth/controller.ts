import { compareSync } from "bcrypt";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../../db";
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from "../../helpers/util";

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
      await db("users").insert(newUser);

      const newlyCreatedUser = await db("users")
        .where({ email })
        .select(
          "id",
          "email",
          "first_name",
          "last_name",
          "phone_number",
          "role",
          "created_at"
        )
        .first();

      return res.status(201).json({
        message: "User registered successfully",
        status: "success",
        data: { ...newlyCreatedUser },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        status: "failure",
      });
    }
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const userExists = await db("users").where({ email }).first();
      if (!userExists) {
        return res.status(404).json({
          message: "User does not exist",
          status: "failure",
        });
      }
      const passwordMatch = compareSync(password, userExists.password);
      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
          status: "failure",
        });
      }
      const { id, first_name, role, created_at } = userExists;
      const payload = { id: id, role: role };
      const access_token = await generateAccessToken(payload);
      const refresh_token = await generateRefreshToken(payload);

      await db("users").where({ email }).update("refresh_token", refresh_token);
      return res.status(200).json({
        message: "Login successful",
        status: "success",
        data: {
          user_id: id,
          first_name,
          role,
          access_token,
          refresh_token,
          created_at,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
        status: "failure",
      });
    }
  };
}

export default AuthController;
