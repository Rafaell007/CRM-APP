import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminEmployeesPage from "./pages/AdminPage/AdminEmployeesPage";
import TablesPage from "./pages/TablesPage";
import TableOrdersPage from "./pages/TableOrdersPage";
import AdminLayout from "./layouts/AdminLayout";
import WaiterLayout from "./layouts/WaiterLayout";
import ProtectedRoute from "./components/ProtectedRoute";

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
    path: "/admin",
    element: (
      <ProtectedRoute role="admin" >
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

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
