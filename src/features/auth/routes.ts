import express from "express";
import AuthValidator from "../../middleware/validators/auth/authValidator";
import AuthController from "./controller";

const authRouter = express.Router();

const { signup, login } = AuthController;
const { signUpValidator, loginValidator } = AuthValidator;

authRouter.post("/signup", signUpValidator, signup);
authRouter.post("/login", loginValidator, login);

export default authRouter;
