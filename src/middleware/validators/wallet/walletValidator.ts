import { NextFunction, Request, Response } from "express";
import InputSanitizer from "./walletInputSanitizer";

type Keys = {
  [index: number]: string;
};

class WalletValidator {
  static walletCreationInputValidator(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { currency } = req.body;

    const missingFields = [currency]
      .map((field, index) => {
        const keys: Keys = { 0: "currency" };
        return field === undefined || field === "" ? keys[index] : null;
      })
      .filter((field) => field !== null)
      .join(", ");

    if (!currency) {
      return res.status(400).json({
        message: `Your missed a required fields: ${missingFields}`,
        status: "failure",
      });
    }

    const errors: string[] = [];

    if (!InputSanitizer.isValidCurrency(currency)) {
      errors.push("The base currency should be either NGN or USD");
    }

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: errors.join("; "), status: "failure" });
    }

    return next();
  }

  static walletFundingInputValidator(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { amount } = req.body;

    const missingFields = [amount]
      .map((field, index) => {
        const keys: Keys = { 0: "amount" };
        return field === undefined || field === "" ? keys[index] : null;
      })
      .filter((field) => field !== null)
      .join(", ");

    if (!amount) {
      return res.status(400).json({
        message: `Your missed a required fields: ${missingFields}`,
        status: "failure",
      });
    }

    const errors: string[] = [];

    if (!InputSanitizer.isValidAmount(amount)) {
      errors.push("Invalid amount format");
    }

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: errors.join("; "), status: "failure" });
    }

    return next();
  }
}

export default WalletValidator;
