import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AUTH_COOKIE } from "../config/auth.ts";
import { JWT_SECRET } from "../config/env.ts";

export interface AuthUser {
  userId: string;
  role: "admin" | "waiter";
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

const NOT_LOGGED_IN = { message: "Not logged in" };

export const requireAuth: RequestHandler = (request, response, next) => {
  const token = request.cookies[AUTH_COOKIE];

  if (typeof token !== "string") {
    response.status(401).json(NOT_LOGGED_IN);
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (
      typeof payload === "string" ||
      typeof payload.userId !== "string" ||
      (payload.role !== "admin" && payload.role !== "waiter")
    ) {
      response.status(401).json(NOT_LOGGED_IN);
      return;
    }

    request.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    response.status(401).json(NOT_LOGGED_IN);
  }
};
