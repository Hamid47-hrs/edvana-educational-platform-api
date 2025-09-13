import express, { Express } from "express";
import apiRoutes from "./api/index.routes";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler";
import { setupSwagger } from "./config/swagger";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

const app: Express = express();

const PORT: number = Number(process.env.PORT || 3000);

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use("/", apiRoutes);

app.use(errorHandler);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}.`);
});
