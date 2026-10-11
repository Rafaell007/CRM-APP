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

const BRAND = "text-center text-lg font-bold uppercase tracking-brand";
const ICON_BUTTON = "flex items-center justify-center p-1.5 text-ink";

const AdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <header className="flex items-center gap-4 bg-surface px-4 py-2 md:hidden">
        <button
          className={ICON_BUTTON}
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
        <p className={BRAND}>Restaurant CRM</p>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/45"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Below md the sidebar is a drawer that slides in from the left */}
      <aside
        className={`flex flex-col bg-surface p-4 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-20 max-md:w-65 max-md:overflow-y-auto max-md:transition-transform max-md:duration-250 md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:p-6 ${isMenuOpen ? "" : "max-md:-translate-x-full"}`}
      >
        <button
          className={`${ICON_BUTTON} self-end md:hidden`}
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={22} aria-hidden="true" />
        </button>

        <p className={`${BRAND} mb-4 border-b border-border pb-4`}>Restaurant CRM</p>

        <nav aria-label="Admin" onClick={() => setIsMenuOpen(false)}>
          <ul className="flex flex-col gap-2">
            {ADMIN_NAV.map((item) => (
              <li key={item.label}>
                <NavItem item={item} theme="light" />
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="mt-6 flex items-center gap-4 rounded border border-border px-4 py-3.5 text-base text-ink hover:border-ink"
          onClick={logout}
        >
          <LogOut size={18} aria-hidden="true" />
          Log out
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
