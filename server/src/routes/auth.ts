import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.ts";
import { AUTH_COOKIE, JWT_SECRET, authCookieOptions } from "../config/auth.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

export const authRouter = Router();

type PublicUserSource = {
  id: string;
  email: string;
  displayName: string;
  role: string;
};

const toPublicUser = ({ id, email, displayName, role }: PublicUserSource) => ({
  id,
  email,
  displayName,
  role,
});

authRouter.post("/login", async (request, response) => {
  const { email, password } = request.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    response.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await User.findOne({ email }).select("+passwordHash");
  const isPasswordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !isPasswordCorrect) {
    response.status(401).json({ message: "Wrong email or password" });
    return;
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "8h",
  });
  response.cookie(AUTH_COOKIE, token, authCookieOptions);

  response.json(toPublicUser(user));
});

authRouter.get("/me", requireAuth, async (request, response) => {
  const user = request.user ? await User.findById(request.user.userId) : null;

  if (!user) {
    response.status(401).json({ message: "Not logged in" });
    return;
  }

  response.json(toPublicUser(user));
});

authRouter.post("/logout", (_request, response) => {
  response.clearCookie(AUTH_COOKIE, authCookieOptions);
  response.status(204).end();
});
