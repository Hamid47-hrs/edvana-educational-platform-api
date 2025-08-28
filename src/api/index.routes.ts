import { NextFunction, Request, Response, Router } from "express";
import { getAPIStatus } from "../controllers/index.controller";
import AppError from "../utils/AppError";

const router = Router();

router.get("/", getAPIStatus);

router.get("/error", (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new AppError(400, "This is an test error!");
  } catch (error) {
    next(error);
  }
});

export default router;
