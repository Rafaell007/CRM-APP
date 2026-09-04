import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import WaiterLayout from "./layouts/WaiterLayout";
import LoginPage from "./pages/login/LoginPage";
import NotFoundPage from "./pages/notFound/NotFoundPage";
import AdminEmployeesPage from "./pages/admin/employees/AdminEmployeesPage";
import TablesPage from "./pages/waiter/TablesPage";
import TableOrdersPage from "./pages/waiter/TableOrdersPage";

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
