import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/auth.middleware";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../controllers/course.controller";

const router = Router();

// --- Public Routes ---
router.route("/").get(getAllCourses);
router.route("/:id").get(getCourseById);

router.use(protect);

// --- Private Routes for "ADMIN" & "TEACHER" ---
router.route("/").post(restrictTo("ADMIN", "TEACHER"), createCourse);
router.route("/:id").patch(updateCourse);

export default router;
