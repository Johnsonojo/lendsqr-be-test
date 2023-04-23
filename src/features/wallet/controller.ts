import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../../db";
import { deductFund, generateAccountNumber, sumFund } from "../../helpers/util";
import { findOneWallet } from "../../service/walletService";

class WalletController {
  static createWallet = async (req: Request, res: Response) => {
    const { currency } = req.body;
    const user_id = req.payload.id;
    const walletId = uuidv4();
    const account_number = generateAccountNumber();
    let account_name = "";

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
      account_name = `${user.first_name} ${user.last_name}`;

      const newWallet = {
        id: walletId,
        currency,
        account_name,
        account_number,
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
          "account_number",
          "created_at"
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
    const { account_number } = req.params;
    const user_id = req.payload.id;

    try {
      const foundWallet = await findOneWallet(user_id, account_number, res);

      const newBalance = sumFund(foundWallet.balance, amount);
      await db("wallets")
        .where({ user_id, account_number })
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
        account_number,
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

  static userTransferFund = async (req: Request, res: Response) => {
    const { amount, receiver_account_number } = req.body;
    const { account_number } = req.params;
    const user_id = req.payload.id;
    try {
      const foundWallet = await findOneWallet(user_id, account_number, res);

      if (foundWallet.account_number === String(receiver_account_number)) {
        return res.status(400).json({
          message: "You cannot transfer fund to yourself",
          status: "failure",
        });
      }
      if (Number(foundWallet.balance) < Number(amount)) {
        return res.status(400).json({
          message: "Insufficient funds",
          status: "failure",
        });
      }

      const receiverWallet = await db("wallets")
        .where({
          account_number: receiver_account_number,
        })
        .first();
      if (!receiverWallet) {
        return res.status(404).json({
          message: "Receiver wallet does not exist",
          status: "failure",
        });
      }
      const newReceiverBalance = sumFund(receiverWallet.balance, amount);
      await db("wallets").where({ id: receiverWallet.id }).update({
        balance: newReceiverBalance,
      });

      const newSenderBalance = deductFund(foundWallet.balance, amount);
      await db("wallets")
        .where({ user_id, account_number: account_number })
        .update({ balance: newSenderBalance });

      // create a transaction record in the walletTransactions table
      const transactionId = uuidv4();
      const newTransaction = {
        id: transactionId,
        amount,
        currency: foundWallet.currency,
        transaction_type: "debit",
        transaction_ref: "transaction_ref_" + transactionId,
        wallet_id: foundWallet.id,
        user_id,
        receiver_id: receiverWallet.user_id,
        receiver_wallet_id: receiverWallet.id,
      };
      await db("walletTransactions").insert(newTransaction);

      const updatedWalletFromDb = await db("wallets").where({
        user_id,
        account_number,
      });

      return res.status(200).json({
        message: "Fund transferred successfully",
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

  static userWithdrawFund = async (req: Request, res: Response) => {
    const { amount } = req.body;
    const { account_number } = req.params;
    const user_id = req.payload.id;
    try {
      const foundWallet = await findOneWallet(user_id, account_number, res);

      if (Number(foundWallet.balance) < Number(amount)) {
        return res.status(400).json({
          message: "Insufficient funds",
          status: "failure",
        });
      }

      const newBalance = deductFund(foundWallet.balance, amount);
      await db("wallets")
        .where({ user_id, account_number })
        .update({ balance: newBalance });

      // create a transaction record in the walletTransactions table
      const transactionId = uuidv4();
      const newTransaction = {
        id: transactionId,
        amount,
        currency: foundWallet.currency,
        transaction_type: "debit",
        transaction_ref: "transaction_ref_" + transactionId,
        wallet_id: foundWallet.id,
        user_id,
      };
      await db("walletTransactions").insert(newTransaction);

      const updatedWalletFromDb = await db("wallets").where({
        user_id,
        account_number,
      });

      return res.status(200).json({
        message: "Fund withdrawal successful",
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

  static userGetWalletByAccountNumber = async (req: Request, res: Response) => {
    const { account_number } = req.params;
    const user_id = req.payload.id;
    try {
      const foundWallet = await findOneWallet(user_id, account_number, res);
      return res.status(200).json({
        message: "Wallet retrieved successfully",
        status: "success",
        data: { ...foundWallet },
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
