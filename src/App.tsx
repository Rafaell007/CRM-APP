import { useEffect } from "react";
import { RouterProvider } from "@tanstack/react-router";
import "./App.css";
import { router } from "./router/router";
import { useAuth } from "./context/authContext";

const App = () => {
  const { user, isLoading } = useAuth();

  // Re-run the route guards when someone logs in or out
  useEffect(() => {
    void router.invalidate();
  }, [user]);

  if (isLoading) return <p>Loading...</p>;

  return <RouterProvider router={router} context={{ user }} />;
};

export default App;
