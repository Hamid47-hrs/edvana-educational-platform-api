import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/auth.middleware";
import { createCourse } from "../controllers/course.controller";

const router = Router();

router.use(protect);

router.post("/", restrictTo("ADMIN", "TEACHER"), createCourse);

export default router;
