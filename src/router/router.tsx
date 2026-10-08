import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import AdminLayout from "../layouts/AdminLayout";
import WaiterLayout from "../layouts/WaiterLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import AdminEmployeesPage from "../pages/AdminPage/AdminEmployeesPage/AdminEmployeesPage";
import AdminAnalyticsPage from "../pages/AdminPage/AdminAnalyticsPage/AdminAnalyticsPage";
import TablesPage from "../pages/TableOrdersPage/TablesPage";
import TableOrdersPage from "../pages/TableOrdersPage/TableOrdersPage";
import type { AuthUser, UserRole } from "../types/models";

interface RouterContext {
  user: AuthUser | null;
}

// Route guards are UX only - Firestore Security Rules protect the data
const requireRole = (user: AuthUser | null, role: UserRole) => {
  if (user?.role !== role) throw redirect({ to: "/login" });
};

const rootRoute = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: ({ context }) => {
    if (context.user?.role === "admin") throw redirect({ to: "/admin" });
    if (context.user?.role === "waiter") throw redirect({ to: "/waiter/tables" });
  },
  component: LoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: ({ context }) => requireRole(context.user, "admin"),
  component: AdminLayout,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/admin/employees" });
  },
});

const adminEmployeesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "employees",
  component: AdminEmployeesPage,
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "analytics",
  component: AdminAnalyticsPage,
});

const waiterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/waiter",
  beforeLoad: ({ context }) => requireRole(context.user, "waiter"),
  component: WaiterLayout,
});

const tablesRoute = createRoute({
  getParentRoute: () => waiterRoute,
  path: "tables",
  component: TablesPage,
});

const tableOrdersRoute = createRoute({
  getParentRoute: () => waiterRoute,
  path: "tables/$tableId",
  component: TableOrdersPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRoute.addChildren([adminIndexRoute, adminEmployeesRoute, adminAnalyticsRoute]),
  waiterRoute.addChildren([tablesRoute, tableOrdersRoute]),
]);

export const router = createRouter({ routeTree, context: { user: null } });

// Makes every <Link to>, redirect() and route param type-checked against this route tree
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
