import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware";
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

/**
 * @swagger
 * tags:
 *   - name: Courses
 *     description: Public and administrative course management
 *   - name: Enrollments
 *     description: Student enrollment in courses
 */

// --- Public Routes ---

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve a list of all courses
 *     tags: [Courses]
 *     responses:
 *       '200':
 *         description: A list of courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.route("/").get(getAllCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Retrieve a single course by its ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to retrieve.
 *     responses:
 *       '200':
 *         description: A single course object.
 *       '404':
 *         description: Course not found.
 */
router.route("/:id").get(getCourseById);

router.use(protect);

// --- Teacher & Admin Routes ---

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the course.
 *                 example: "Introduction to TypeScript"
 *               description:
 *                 type: string
 *                 description: A detailed description for the course.
 *                 example: "Learn the fundamentals of TypeScript for back-end development."
 *     responses:
 *       '201':
 *         description: Course created successfully.
 *       '403':
 *         description: Forbidden - User does not have the required role.
 */
router.route("/").post(restrictTo("ADMIN", "TEACHER"), createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   patch:
 *     summary: Update an existing course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the course.
 *               description:
 *                 type: string
 *                 description: The updated description of the course.
 *     responses:
 *       '200':
 *         description: Course updated successfully.
 *       '403':
 *         description: Forbidden - User is not the owner or an admin.
 *       '404':
 *         description: Course not found.
 *
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to delete.
 *     responses:
 *       '204':
 *         description: Course deleted successfully.
 *       '403':
 *         description: Forbidden - User is not the owner or an admin.
 *       '404':
 *         description: Course not found.
 */
router
  .route("/:id")
  .patch(restrictTo("ADMIN", "TEACHER"), validateCourseUpdate, updateCourse)
  .delete(restrictTo("ADMIN", "TEACHER"), deleteCourse);

/**
 * @swagger
 * /courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll the current student in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to enroll in.
 *     responses:
 *       '200':
 *         description: Successfully enrolled in the course.
 *       '403':
 *         description: Forbidden - User is not a student.
 */

router.route("/:courseId/enroll").post(restrictTo("STUDENT"), enrollInCourse);

/**
 * @swagger
 * /courses/{courseId}/lessons:
 *   get:
 *     summary: Get all lessons for an enrolled course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course.
 *     responses:
 *       '200':
 *         description: A list of lessons for the course.
 *       '403':
 *         description: Forbidden - User is not enrolled in the course.
 */

router.route("/:courseId/lessons").get(getLessonsForCourse);

export default router;
