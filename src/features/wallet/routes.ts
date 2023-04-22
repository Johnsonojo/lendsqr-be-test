import express from "express";
import AuthCheck from "../../middleware/authCheck";
import WalletValidator from "../../middleware/validators/wallet/walletValidator";
import WalletController from "./controller";

const walletRouter = express.Router();

const { verifyAccessToken } = AuthCheck;
const {
  walletCreationInputValidator,
  walletFundingInputValidator,
  walletTransferInputValidator,
} = WalletValidator;
const {
  createWallet,
  createMultipleWallets,
  userFundTheirWallet,
  userTransferFund,
  userWithdrawFund,
} = WalletController;

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

walletRouter.post(
  "/transfer/:accountNumber",
  verifyAccessToken,
  walletTransferInputValidator,
  userTransferFund
);

walletRouter.post(
  "/withdraw/:accountNumber",
  verifyAccessToken,
  walletFundingInputValidator,
  userWithdrawFund
);

export default walletRouter;
