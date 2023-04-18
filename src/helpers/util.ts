import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateAccessToken = async (payload: object) => {
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET || "";
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    return token;
  } catch (err: any) {
    throw { message: err.message, status: "failure" };
  }
};

export const hashPassword = (password: string) => {
  const salt_rounds = 10;
  return bcrypt.hashSync(password, salt_rounds);
};
