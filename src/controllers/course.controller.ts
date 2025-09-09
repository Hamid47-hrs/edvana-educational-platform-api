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
