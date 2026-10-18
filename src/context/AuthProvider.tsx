import { useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as authApi from "../api/http/auth";
import { AuthContext } from "./authContext";
import type { AuthUser } from "../types/models";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    authApi
      .fetchCurrentUser()
      .catch(() => null)
      .then((currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    setUser(await authApi.login(email, password));
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    queryClient.clear(); // the next user must not see the previous user's cached data
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
