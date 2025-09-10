import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import AppError from "../utils/AppError";

const prisma = new PrismaClient();

export const markLessonAsComplete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lessonId } = req.params;
    const studentId = (req as any).user.id;

    await prisma.lessonCompletion.create({
      data: {
        student: { connect: { id: studentId } },
        lesson: { connect: { id: lessonId } },
      },
    });

    res.status(200).json({
      status: "Seccess.",
      message: "Lesson marked as complete.",
    });
  } catch (error) {
    if (error instanceof Error && (error as any).code === "P2002") {
      return next(new AppError(400, "You have already completed this lesson."));
    }
    next(error);
  }
};
