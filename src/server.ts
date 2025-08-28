import express, { Application } from "express";
import apiRoutes from "./api/index.routes";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app: Application = express();

const PORT: number = Number(process.env.PORT || 3000);

app.use(express.json());

app.use("/", apiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}.`);
});
