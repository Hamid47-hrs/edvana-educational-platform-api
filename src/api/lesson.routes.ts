import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware";
import { markLessonAsComplete } from "../controllers/lesson.controller";

const router = Router();

router.use(protect, restrictTo("STUDENT"));

router.route("/:lessonId/comolete").post(markLessonAsComplete);

export default router;
