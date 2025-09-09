import e, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";

const prisma = new PrismaClient();

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new AppError(400, "User with this email already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      status: "Success.",
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError(401, "Invalid Email or Password!");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new AppError(401, "Invalid Email or Password!");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    res.status(200).json({
      status: "Success.",
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyEnrolledCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = (req as any).user.id;

    const userWithCourses = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        enrolledCourses: true,
      },
    });

    if (!userWithCourses) {
      throw new AppError(404, "User not found.");
    }

    res.status(200).json({
      status: "Seccess.",
      data: { courses: userWithCourses.enrolledCourses },
    });
  } catch (error) {
    next(error);
  }
};
