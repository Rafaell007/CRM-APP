import { Outlet } from "@tanstack/react-router";
import { LayoutGrid, ClipboardList, ChartColumn } from "lucide-react";
import NavItem, { type NavItemData } from "./NavItem";
import "./WaiterLayout.css";

const WAITER_NAV: NavItemData[] = [
  { to: "/waiter/tables", label: "Tables", Icon: LayoutGrid },
  { label: "Orders", Icon: ClipboardList },
  { label: "Statistics", Icon: ChartColumn },
];

const WaiterLayout = () => {
  return (
    <div className="waiter-layout">
      <aside className="waiter-layout__sidebar">
        <p className="waiter-layout__brand">Restaurant CRM</p>

        <nav aria-label="Waiter">
          <ul className="waiter-layout__list">
            {WAITER_NAV.map((item) => (
              <li key={item.label}>
                <NavItem item={item} block="waiter-layout" />
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="waiter-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default WaiterLayout;
