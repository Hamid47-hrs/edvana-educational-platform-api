import express, { Express, Application } from "express";
import apiRoutes from "./api/index.routes";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

const PORT: number = Number(process.env.PORT || 3000);

app.use("/", apiRoutes);

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}.`);
});
