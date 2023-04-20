import express from "express";
import AuthCheck from "../../middleware/authCheck";
import WalletValidator from "../../middleware/validators/wallet/walletValidator";
import WalletController from "./controller";

const { verifyAccessToken } = AuthCheck;
const { walletInputValidator } = WalletValidator;

const walletRouter = express.Router();

const { createWallet } = WalletController;

walletRouter.post(
  "/create",
  verifyAccessToken,
  walletInputValidator,
  createWallet
);

export default walletRouter;
