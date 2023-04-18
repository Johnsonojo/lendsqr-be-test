import express, { Request, Response } from "express";

const otherRouter = express.Router();

otherRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Lendsqr API!",
  });
});

otherRouter.all("*", (req: Request, res: Response) =>
  res.status(404).json({
    message: "Oooop! This page does not exist",
  })
);

export default otherRouter;
