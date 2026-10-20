import type { CookieOptions } from "express";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is missing in server/.env");
}

export const JWT_SECRET: string = secret;

export const AUTH_COOKIE = "token";
export const REFRESH_COOKIE = "refreshToken";

export const ACCESS_TOKEN_TTL = "15m";
const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export const authCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: FIFTEEN_MINUTES_IN_MS,
};

export const refreshCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: REFRESH_TOKEN_TTL_MS,
  path: "/api/auth",
};

// read all of of the env variables and then put them into process
