import type { CookieOptions } from "express";
import { IS_PRODUCTION } from "./env.ts";

export const AUTH_COOKIE = "token";
export const REFRESH_COOKIE = "refreshToken";

export const ACCESS_TOKEN_TTL = "15m";
const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: IS_PRODUCTION,
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
