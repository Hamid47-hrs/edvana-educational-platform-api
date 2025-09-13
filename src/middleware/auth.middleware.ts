import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import AppError from "../utils/AppError";

const prisma = new PrismaClient();

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        401,
        "You are not Logged in! Please log in first to get access."
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      throw new AppError(
        401,
        "The user belonging to this token no longer exists!"
      );
    }

    (req as any).user = currentUser;

    next();
  } catch (error) {
    next(new AppError(401, "Invalid token or session expired!"));
  }
};

export const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user || !roles.includes((req as any).user.role)) {
      throw new AppError(
        403,
        "You do not have the permission to perform this action"
      );
    }
    next();
  };
};
