import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import WaiterLayout from "../layouts/WaiterLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import AdminEmployeesPage from "../pages/AdminPage/AdminEmployeesPage/AdminEmployeesPage";
import TablesPage from "../pages/TableOrdersPage/TablesPage";
import TableOrdersPage from "../pages/TableOrdersPage/TableOrdersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/employees" replace />,
      },
      {
        path: "employees",
        element: <AdminEmployeesPage />,
      },
    ],
  },
  {
    path: "/waiter",
    element: <WaiterLayout />,
    children: [
      {
        path: "tables",
        element: <TablesPage />,
      },
      {
        path: "tables/:tableId",
        element: <TableOrdersPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
