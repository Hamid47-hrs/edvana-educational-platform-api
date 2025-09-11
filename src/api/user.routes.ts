import { Router } from "express";
import {
  getMyEnrolledCourses,
  getMyProfile,
  loginUser,
  registerUser,
} from "../controllers/user.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users & Auth
 *     description: User registration, login, and profile management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users & Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *       '400':
 *         description: Bad request (e.g., email already exists).
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users & Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: Login successful, returns JWT token.
 *       '401':
 *         description: Invalid email or password.
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the profile of the currently logged-in user
 *     tags: [Users & Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: The user's profile data.
 *       '401':
 *         description: Unauthorized.
 */
router.get("/me", protect, getMyProfile);

/**
 * @swagger
 * /users/me/courses:
 *   get:
 *     summary: Get all courses the current student is enrolled in
 *     tags: [Users & Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of the student's enrolled courses.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden (user is not a student).
 */
router.get("/me/courses", protect, restrictTo("STUDENT"), getMyEnrolledCourses);

export default router;
