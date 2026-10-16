import type { CookieOptions } from "express";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is missing in server/.env");
}

export const JWT_SECRET: string = secret;

export const AUTH_COOKIE = "token";

const EIGHT_HOURS_IN_MS = 8 * 60 * 60 * 1000;

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: EIGHT_HOURS_IN_MS,
};
