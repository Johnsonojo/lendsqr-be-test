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
  userFundTheirWallet,
  userTransferFund,
  userWithdrawFund,
  userGetWalletByAccountNumber,
} = WalletController;

walletRouter.post(
  "/create",
  verifyAccessToken,
  walletCreationInputValidator,
  createWallet
);

walletRouter.post(
  "/fund/:account_number",
  verifyAccessToken,
  walletFundingInputValidator,
  userFundTheirWallet
);

walletRouter.post(
  "/transfer/:account_number",
  verifyAccessToken,
  walletTransferInputValidator,
  userTransferFund
);

walletRouter.post(
  "/withdraw/:account_number",
  verifyAccessToken,
  walletFundingInputValidator,
  userWithdrawFund
);

// These last route is added for testing purpose
walletRouter.get(
  "/:account_number",
  verifyAccessToken,
  userGetWalletByAccountNumber
);

export default walletRouter;
