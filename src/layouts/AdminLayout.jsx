import { NavLink, Outlet } from "react-router";
import {
  House,
  CalendarDays,
  Wallet,
  Workflow,
  ChartLine,
  UsersRound,
  Luggage,
  Stethoscope,
} from "lucide-react";
import "./AdminLayout.css";

const ADMIN_NAV = [
  { to: "/admin/home", label: "Home", Icon: House },
  { to: "/admin/shift", label: "Shift", Icon: CalendarDays },
  { to: "/admin/payroll", label: "Payroll", Icon: Wallet },
  { to: "/admin/tasks", label: "Tasks", Icon: Workflow },
  { to: "/admin/analytics", label: "Analytics", Icon: ChartLine },
  { to: "/admin/employees", label: "Employees", Icon: UsersRound },
  { to: "/admin/vacation", label: "Vacation", Icon: Luggage },
  { to: "/admin/sick-days", label: "Sick days", Icon: Stethoscope },
];

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <p className="admin-layout__brand">Restaurant CRM</p>

        <nav aria-label="Admin">
          <ul className="admin-layout__list">
            {ADMIN_NAV.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "admin-layout__link admin-layout__link--active"
                      : "admin-layout__link"
                  }
                >
                  <Icon className="admin-layout__icon" size={18} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
