import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import AppError from "../utils/AppError";

const prisma = new PrismaClient();

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;
    const teacherId = (req as any).user!.id;
    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        teacher: {
          connect: {
            id: teacherId,
          },
        },
      },
    });

    res.status(201).json({ status: "Success.", data: { course: newCourse } });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await prisma.course.findMany();

    res.status(200).json({
      status: "Success.",
      result: courses.length,
      data: {
        courses,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new AppError(404, "There is no course with that ID.");
    }

    res.status(200).json({
      status: "Success.",
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const course = await prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new AppError(404, "There is no course with that ID.");
    }

    if (
      (req as any).user.role !== "ADMIN" &&
      course.teacherId !== (req as any).user.id
    ) {
      throw new AppError(
        403,
        "You do not have permission to update this course."
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    res.status(200).json({
      status: "Success.",
      data: {
        course: updatedCourse,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new AppError(404, "There is no course with that ID.");
    }

    if (
      (req as any).user.role !== "ADMIN" &&
      course.teacherId !== (req as any).user.id
    ) {
      throw new AppError(
        403,
        "You do not have permission to delete this course."
      );
    }

    await prisma.course.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const enrollInCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const studentId = (req as any).user.id;

    await prisma.course.update({
      where: { id: courseId },
      data: {
        students: {
          connect: {
            id: studentId,
          },
        },
      },
    });

    res.status(200).json({
      status: "Success.",
      message: "Successfully enrolled in the course.",
    });
  } catch (error) {
    next(error);
  }
};

export const getLessonsForCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const userId = (req as any).user.id;

    const enrollment = await prisma.course.findFirst({
      where: {
        id: courseId,
        students: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!enrollment && (req as any).user.role !== "ADMIN") {
      throw new AppError(403, "You are not enrolled in this course.");
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
    });

    res.status(200).json({
      status: "Success.",
      data: { lessons },
    });
  } catch (error) {
    next(error);
  }
};
