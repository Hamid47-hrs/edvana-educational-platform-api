import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware";
import { markLessonAsComplete } from "../controllers/lesson.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Lessons
 *     description: Lesson management and progress tracking
 */

router.use(protect, restrictTo("STUDENT"));

/**
 * @swagger
 * /lessons/{lessonId}/complete:
 *   post:
 *     summary: Mark a lesson as complete for the current student
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lesson to mark as complete.
 *     responses:
 *       '200':
 *         description: Lesson marked as complete successfully.
 *       '400':
 *         description: Bad request (e.g., lesson already completed).
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden (user is not a student).
 */
router.route("/:lessonId/comolete").post(markLessonAsComplete);

export default router;
