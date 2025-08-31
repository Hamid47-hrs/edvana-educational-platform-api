import { User } from "../../src/generated/prisma";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
