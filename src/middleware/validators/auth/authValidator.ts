import { NextFunction, Request, Response } from "express";
import InputSanitizer from "./authInputSanitizer";

type Keys = {
  [index: number]: string;
};

class AuthValidator {
  static signUpValidator = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { first_name, last_name, email, password, phone_number } = req.body;

    const missingFields = [first_name, last_name, email, password, phone_number]
      .map((field, index) => {
        const keys: Keys = {
          0: "first_name",
          1: "last_name",
          2: "email",
          3: "password",
          4: "phone_number",
        };
        return field === undefined || field === "" ? keys[index] : null;
      })
      .filter((field) => field !== null)
      .join(", ");

    if (!first_name || !last_name || !email || !password || !phone_number) {
      return res.status(400).json({
        message: `Your missed a required fields: ${missingFields}`,
        status: "failure",
      });
    }

    const errors: string[] = [];

    if (!InputSanitizer.isValidName(first_name))
      errors.push("The first name you provided is too short");

    if (!InputSanitizer.isValidName(last_name))
      errors.push("The last name you provided is too short");

    if (!InputSanitizer.isEmail(email))
      errors.push("Please provide a valid email address");

    if (!InputSanitizer.isValidPassword(password))
      errors.push(
        "Password must be at least eight characters consisting of at least one uppercase, one lowercase, and one number"
      );

    if (!InputSanitizer.isValidPhoneNumber(phone_number))
      errors.push("Please provide a valid phone number");

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: errors.join("; "), status: "failure" });
    }

    return next();
  };

  static loginValidator = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const missingFields = [email, password]
      .map((field, index) => {
        const keys: Keys = {
          0: "email",
          1: "password",
        };
        return field === undefined || field === "" ? keys[index] : null;
      })
      .filter((field) => field !== null)
      .join(", ");

    if (!email || !password) {
      return res.status(400).json({
        message: `Your missed a required fields: ${missingFields}`,
        status: "failure",
      });
    }

    const errors: string[] = [];

    if (!InputSanitizer.isEmail(email))
      errors.push("Please provide a valid email address");

    if (!InputSanitizer.isValidPassword(password))
      errors.push(
        "Password must be at least eight characters consisting of at least one uppercase, one lowercase, and one number"
      );

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: errors.join("; "), status: "failure" });
    }

    return next();
  };
}

export default AuthValidator;
