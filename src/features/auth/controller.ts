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
      const { id, first_name, role } = userExists;
      const payload = { id: id, role: role };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      await db("users").where({ email }).update("refresh_token", refreshToken);
      res.status(200).json({
        message: "Login successful",
        status: "success",
        data: {
          userId: id,
          firstName: first_name,
          role,
          accessToken,
          refreshToken,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
        status: "failure",
      });
    }
  };
}

export default AuthController;
