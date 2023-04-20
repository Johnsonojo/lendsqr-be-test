import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../../db";
import { generateAccountNumber } from "../../helpers/util";

class WalletController {
  static createWallet = async (req: Request, res: Response) => {
    const { currency } = req.body;
    const user_id = req.payload.id;
    const walletId = uuidv4();
    const accountNumber = generateAccountNumber();
    let accountName = "";
    try {
      const foundWallet = await db("wallets").where({ id: walletId }).first();
      if (foundWallet) {
        return res.status(409).json({
          message: "Wallet already exists",
          status: "failure",
        });
      }
      // get user from db and set account name to user's first name and last name
      const user = await db("users").where({ id: user_id }).first();
      if (user) {
        accountName = `${user.first_name} ${user.last_name}`;
      }

      const newWallet = {
        id: walletId,
        currency,
        account_name: accountName,
        account_number: accountNumber,
        user_id,
      };
      await db("wallets").insert(newWallet);
      const newlyCreatedWallet = await db("wallets")
        .where({ id: walletId })
        .select(
          "id",
          "user_id",
          "balance",
          "currency",
          "account_name",
          "account_number"
        )
        .first();
      return res.status(201).json({
        message: "Wallet created successfully",
        status: "success",
        data: { ...newlyCreatedWallet },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        status: "failure",
        data: error,
      });
    }
  };
}

export default WalletController;
