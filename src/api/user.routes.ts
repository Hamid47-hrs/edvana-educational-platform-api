import { Router } from "express";
import {
  getMyEnrolledCourses,
  getMyProfile,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMyProfile);

router.get("/me/courses", protect, restrictTo("STUDENT"), getMyEnrolledCourses);

export default router;
