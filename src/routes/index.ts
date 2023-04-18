import express, { Express } from "express";
import otherRouter from "./otherRoutes";

const app: Express = express();

app.use("/", otherRouter);

export default app;
