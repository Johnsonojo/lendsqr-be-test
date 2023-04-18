import express from "express";
import AuthValidator from "../../middleware/validators/auth/authValidator";
import AuthController from "./controller";

const authRouter = express.Router();

const { signup } = AuthController;
const { signUpValidator } = AuthValidator;

authRouter.post("/signup", signUpValidator, signup);

export default authRouter;
