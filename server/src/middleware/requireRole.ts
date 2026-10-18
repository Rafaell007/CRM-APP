import type { RequestHandler } from "express";
import type { AuthUser } from "./requireAuth.ts";

export const requireRole =
  (role: AuthUser["role"]): RequestHandler =>
  (request, response, next) => {
    if (request.user?.role !== role) {
      response.status(403).json({ message: "You don't have access to this" });
      return;
    }

    next();
  };
