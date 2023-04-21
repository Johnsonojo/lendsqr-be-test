import express from "express";
import AuthCheck from "../../middleware/authCheck";
import WalletValidator from "../../middleware/validators/wallet/walletValidator";
import WalletController from "./controller";

const walletRouter = express.Router();

const { verifyAccessToken } = AuthCheck;
const { walletCreationInputValidator, walletFundingInputValidator } =
  WalletValidator;
const { createWallet, createMultipleWallets, userFundTheirWallet } =
  WalletController;

walletRouter.post(
  "/create",
  verifyAccessToken,
  walletCreationInputValidator,
  createWallet
);

walletRouter.post(
  "/create-multiple",
  verifyAccessToken,
  walletCreationInputValidator,
  createMultipleWallets
);

walletRouter.post(
  "/fund/:accountNumber",
  verifyAccessToken,
  walletFundingInputValidator,
  userFundTheirWallet
);

export default walletRouter;
