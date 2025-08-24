import { Router } from "express";
import { getAPIStatus } from "../controllers/index.controller";

const router = Router();

router.get("/", getAPIStatus);

export default router;
