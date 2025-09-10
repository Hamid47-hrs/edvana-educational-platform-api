import { Router } from "express";
import { getAPIStatus } from "../controllers/index.controller";
import userRoutes from "./user.routes";
import courseRoutes from "./course.routes";
import lessonRoutes from "./lesson.routes";

const router = Router();

router.get("/", getAPIStatus);

// API Routes
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/lessons", lessonRoutes);

export default router;
