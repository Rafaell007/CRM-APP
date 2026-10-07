import { NavLink, Outlet } from "react-router";
import { LayoutGrid, ClipboardList, ChartColumn } from "lucide-react";
import "./WaiterLayout.css";

const WAITER_NAV = [
  { to: "/waiter/tables", label: "Tables", Icon: LayoutGrid },
  { to: "/waiter/orders", label: "Orders", Icon: ClipboardList },
  { to: "/waiter/statistics", label: "Statistics", Icon: ChartColumn },
];

const WaiterLayout = () => {
  return (
    <div className="waiter-layout">
      <aside className="waiter-layout__sidebar">
        <p className="waiter-layout__brand">Restaurant CRM</p>

        <nav aria-label="Waiter">
          <ul className="waiter-layout__list">
            {WAITER_NAV.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "waiter-layout__link waiter-layout__link--active"
                      : "waiter-layout__link"
                  }
                >
                  <Icon className="waiter-layout__icon" size={18} aria-hidden="true" />
                  {label}
                </NavLink>
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
