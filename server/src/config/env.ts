import { existsSync } from "node:fs";

// Render has no .env file: there the variables come from the dashboard
if (existsSync(".env")) {
  process.loadEnvFile();
}

export const readEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing in server/.env`);
  }

  return value;
};

export const MONGODB_URI = readEnv("MONGODB_URI");
export const JWT_SECRET = readEnv("JWT_SECRET");
export const PORT = Number(process.env.PORT ?? 3000);
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
