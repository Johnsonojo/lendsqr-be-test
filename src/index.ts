import express, { Express } from "express";
import registerMiddlewares from "./middleware";
import router from "./routes";

const app: Express = express();

registerMiddlewares(app);

app.use(router);

const port = process.env.SERVER_PORT || 8000;
app.listen(port, () => console.log(`Lendsqr is running on port ${port}`));
