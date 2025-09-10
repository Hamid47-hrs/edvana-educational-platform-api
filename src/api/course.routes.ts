import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/auth.middleware";
import { validateCourseUpdate } from "../middleware/course.validators";
import {
  createCourse,
  deleteCourse,
  enrollInCourse,
  getAllCourses,
  getCourseById,
  getLessonsForCourse,
  updateCourse,
} from "../controllers/course.controller";

const router = Router();

// --- Public Routes ---
router.route("/").get(getAllCourses);
router.route("/:id").get(getCourseById);

router.use(protect);

// --- Private Routes for "ADMIN" & "TEACHER" ---
router.route("/").post(restrictTo("ADMIN", "TEACHER"), createCourse);
router
  .route("/:id")
  .patch(restrictTo("ADMIN", "TEACHER"), validateCourseUpdate, updateCourse)
  .delete(restrictTo("ADMIN", "TEACHER"), deleteCourse);

router.route("/:courseId/enroll").post(restrictTo("STUDENT"), enrollInCourse);
router.route("/:courseId/lessons").get(getLessonsForCourse);

export default router;
