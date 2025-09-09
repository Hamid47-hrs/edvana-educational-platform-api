import { Router } from "express";
import {
  getMyEnrolledCourses,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me/courses", protect, restrictTo("STUDENT"), getMyEnrolledCourses);

export default router;
