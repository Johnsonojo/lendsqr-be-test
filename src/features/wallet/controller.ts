import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../../db";
import { generateAccountNumber, sumFund } from "../../helpers/util";

class WalletController {
  static createWallet = async (req: Request, res: Response) => {
    const { currency } = req.body;
    const user_id = req.payload.id;
    const walletId = uuidv4();
    const accountNumber = generateAccountNumber();
    let accountName = "";
    try {
      const foundWallet = await db("wallets").where({ user_id }).first();
      if (foundWallet) {
        return res.status(409).json({
          message: "User already has a wallet",
          status: "failure",
        });
      }
      // get user from db and set account name to user's first name and last name
      const user = await db("users").where({ id: user_id }).first();
      accountName = `${user.first_name} ${user.last_name}`;

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
      });
    }
  };

  static createMultipleWallets = async (req: Request, res: Response) => {
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
      accountName = `${user.first_name} ${user.last_name}`;

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
      });
    }
  };

  static userFundTheirWallet = async (req: Request, res: Response) => {
    const { amount } = req.body;
    const { accountNumber } = req.params;
    const user_id = req.payload.id;
    try {
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

      const newBalance = sumFund(foundWallet.balance, amount);
      await db("wallets")
        .where({ user_id, account_number: accountNumber })
        .update({ balance: newBalance });

      // create a transaction record in the walletTransactions table
      const transactionId = uuidv4();
      const newTransaction = {
        id: transactionId,
        amount,
        currency: foundWallet.currency,
        transaction_type: "credit",
        transaction_ref: "transaction_ref_" + transactionId,
        wallet_id: foundWallet.id,
        user_id,
        receiver_id: user_id,
        receiver_wallet_id: foundWallet.id,
      };
      await db("walletTransactions").insert(newTransaction);

      const updatedWalletFromDb = await db("wallets").where({
        user_id,
        account_number: accountNumber,
      });

      return res.status(200).json({
        message: "Wallet funded successfully",
        status: "success",
        data: { ...updatedWalletFromDb[0] },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
        status: "failure",
      });
    }
  };
}

export default WalletController;
