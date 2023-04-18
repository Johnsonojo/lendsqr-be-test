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
      res.status(400).json({
        message: `Your missed a required fields: ${missingFields}`,
        status: "failure",
      });
    }

    const response = (message: string) => {
      res.status(400).json({ message, status: "failure" });
    };

    if (!InputSanitizer.isValidName(first_name))
      return response("The first name you provided is too short");

    if (!InputSanitizer.isValidName(last_name))
      return response("The last name you provided is too short");

    if (!InputSanitizer.isEmail(email))
      return response("Please provide a valid email address");

    if (!InputSanitizer.isValidPassword(password))
      return response(
        "Password must be at least eight characters consisting of at least one uppercase, one lowercase, and one number"
      );

    if (!InputSanitizer.isValidPhoneNumber(phone_number))
      return response("Please provide a valid phone number");

    req.first_name = first_name.trim();
    req.last_name = last_name.trim();
    req.email = email.trim();
    req.password = password.trim();
    req.phone_number = phone_number.trim();

    return next();
  };
}

export default AuthValidator;
