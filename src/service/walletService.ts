import { Response } from "express";
import db from "../db";

export const findOneWallet = async (
  user_id: number,
  account_umber: string,
  res: Response
) => {
  const foundWallet = await db("wallets")
    .where({
      user_id,
      account_number: account_umber,
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
