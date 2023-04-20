import express, { Express } from "express";
import authRouter from "../features/auth/routes";
import walletRouter from "../features/wallet/routes";
import otherRouter from "./otherRoutes";

const app: Express = express();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/wallet", walletRouter);
app.use("/", otherRouter);

export default app;
