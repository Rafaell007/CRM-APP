import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import {
  House,
  CalendarDays,
  Wallet,
  Workflow,
  ChartLine,
  UsersRound,
  Luggage,
  Stethoscope,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import NavItem, { type NavItemData } from "./NavItem";
import "./AdminLayout.css";
import { useAuth } from "../context/authContext";

const ADMIN_NAV: NavItemData[] = [
  { label: "Home", Icon: House },
  { label: "Shift", Icon: CalendarDays },
  { label: "Payroll", Icon: Wallet },
  { label: "Tasks", Icon: Workflow },
  { to: "/admin/analytics", label: "Analytics", Icon: ChartLine },
  { to: "/admin/employees", label: "Employees", Icon: UsersRound },
  { label: "Vacation", Icon: Luggage },
  { label: "Sick days", Icon: Stethoscope },
];

const AdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="admin-layout">
      {/* mobile only*/}
      <header className="admin-layout__topbar">
        <button
          className="admin-layout__burger"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
        <p className="admin-layout__brand">Restaurant CRM</p>
      </header>

      {isMenuOpen && (
        <div
          className="admin-layout__overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside
        className={`admin-layout__sidebar ${isMenuOpen ? "admin-layout__sidebar--open" : ""}`}
      >
        <button
          className="admin-layout__close"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={22} aria-hidden="true" />
        </button>

        <p className="admin-layout__brand">Restaurant CRM</p>

        <nav aria-label="Admin" onClick={() => setIsMenuOpen(false)}>
          <ul className="admin-layout__list">
            {ADMIN_NAV.map((item) => (
              <li key={item.label}>
                <NavItem item={item} block="admin-layout" />
              </li>
            ))}
          </ul>
        </nav>

        <button className="admin-layout__logout" onClick={logout}>
          <LogOut size={18} aria-hidden="true" />
          Log out
        </button>
      </aside>

      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
