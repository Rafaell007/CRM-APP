import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import AdminEmployeesPage from "./pages/AdminEmployeesPage";
import TablesPage from "./pages/TablesPage";
import TableOrdersPage from "./pages/TableOrdersPage";
import AdminLayout from "./layouts/AdminLayout";


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
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/admin/employees" replace />,
        },
        {
          path: "employees",
          element: <AdminEmployeesPage />
        }
      ]
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
