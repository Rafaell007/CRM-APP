import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import EmployeesPage from "./pages/EmployeesPage";
import TablesPage from "./pages/TablesPage";
import TableOrdersPage from "./pages/TableOrdersPage";


 const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/admin/employees",
      element: <EmployeesPage />,
    },
    {
      path: "/tables",
      element: <TablesPage />,
    },
    {
      path: "/tables/:tableId",
      element: <TableOrdersPage />,
    },
    {
      path: "*",
      element: <h1>404 — Page not found</h1>,
    },
  ]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
