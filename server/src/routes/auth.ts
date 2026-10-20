import { Router } from "express";
import type { Response } from "express";
import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.ts";
import { RefreshToken } from "../models/RefreshToken.ts";
import {
  ACCESS_TOKEN_TTL,
  AUTH_COOKIE,
  JWT_SECRET,
  REFRESH_COOKIE,
  REFRESH_TOKEN_TTL_MS,
  authCookieOptions,
  refreshCookieOptions,
} from "../config/auth.ts";
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

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const issueTokens = async (response: Response, user: { id: string; role: string }) => {
  const accessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
  const refreshToken = randomBytes(32).toString("hex");

  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  response.cookie(AUTH_COOKIE, accessToken, authCookieOptions);
  response.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
};

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

  await issueTokens(response, user);

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

authRouter.post("/refresh", async (request, response) => {
  const refreshToken = request.cookies[REFRESH_COOKIE];

  if (typeof refreshToken !== "string") {
    response.status(401).json({ message: "Not logged in" });
    return;
  }

  const storedToken = await RefreshToken.findOneAndDelete({
    tokenHash: hashToken(refreshToken),
  });
  const user =
    storedToken && storedToken.expiresAt > new Date()
      ? await User.findById(storedToken.userId)
      : null;

  if (!user) {
    response.status(401).json({ message: "Not logged in" });
    return;
  }

  await issueTokens(response, user);

  response.json(toPublicUser(user));
});

authRouter.post("/logout", async (request, response) => {
  const refreshToken = request.cookies[REFRESH_COOKIE];

  if (typeof refreshToken === "string") {
    await RefreshToken.deleteOne({ tokenHash: hashToken(refreshToken) });
  }

  response.clearCookie(AUTH_COOKIE, authCookieOptions);
  response.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
  response.status(204).end();
});

