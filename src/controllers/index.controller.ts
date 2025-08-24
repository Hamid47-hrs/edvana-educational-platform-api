import { Request, Response } from "express";

export const getAPIStatus = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Educational Application is running with TypeScript.",
  });
};
