import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    console.error(err);
  }

  res.status(statusCode).json({
    status: "error",
    message: message,
  });
};

export default errorHandler;
