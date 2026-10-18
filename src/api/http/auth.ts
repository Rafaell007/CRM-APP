import { ApiError, apiFetch, apiRequest } from "./client";
import type { AuthUser } from "../../types/models";

export const login = (email: string, password: string) =>
  apiFetch<AuthUser>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const logout = async () => {
  await apiRequest("/auth/logout", { method: "POST" });
};

export const fetchCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    return await apiFetch<AuthUser>("/auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
};
