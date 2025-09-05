import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import AppError from "../utils/AppError";

export const validateCourseUpdate = [
  body("title")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Title must be a non-empty string!"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string!"),

  (req: Request, res: Response, next: NextFunction) => {
    if (Object.keys(req.body).length === 0) {
      return next(
        new AppError(
          400,
          "Request body can not be EMPTY! Please provide data to update."
        )
      );
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);

      return next(new AppError(400, errorMessages.join(", ")));
    }

    next();
  },
];
