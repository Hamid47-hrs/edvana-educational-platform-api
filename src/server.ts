import express, { Express } from "express";
import apiRoutes from "./api/index.routes";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler";
import { setupSwagger } from "./config/swagger";

dotenv.config();

const app: Express = express();

const PORT: number = Number(process.env.PORT || 3000);

app.use(express.json());

app.use("/", apiRoutes);

app.use(errorHandler);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}.`);
});
