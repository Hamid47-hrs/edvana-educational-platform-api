import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";

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

    res.status(201).json({ status: "success.", data: { course: newCourse } });
  } catch (error) {
    next(error);
  }
};
