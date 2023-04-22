import { Response } from "express";
import db from "../db";

export const findOneWallet = async (
  user_id: number,
  accountNumber: string,
  res: Response
) => {
  const foundWallet = await db("wallets")
    .where({
      user_id,
      account_number: accountNumber,
    })
    .first();

  if (!foundWallet) {
    return res.status(404).json({
      message: "Wallet not found",
      status: "failure",
    });
  }

  return foundWallet;
};
