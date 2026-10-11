import { Outlet } from "@tanstack/react-router";
import { LayoutGrid, ClipboardList, ChartColumn } from "lucide-react";
import NavItem, { type NavItemData } from "./NavItem";

const WAITER_NAV: NavItemData[] = [
  { to: "/waiter/tables", label: "Tables", Icon: LayoutGrid },
  { label: "Orders", Icon: ClipboardList },
  { label: "Statistics", Icon: ChartColumn },
];

const WaiterLayout = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="bg-ink p-4 md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:p-6">
        <p className="mb-4 border-b border-border-dark pb-4 text-center text-lg font-bold uppercase tracking-brand text-white">
          Restaurant CRM
        </p>

        <nav aria-label="Waiter">
          <ul className="flex gap-2 overflow-x-auto md:flex-col md:overflow-x-visible">
            {WAITER_NAV.map((item) => (
              <li key={item.label}>
                <NavItem item={item} theme="dark" />
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default WaiterLayout;
