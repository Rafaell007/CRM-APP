import { NavLink, Outlet } from "react-router";

const WAITER_NAV = [
  { to: "/waiter/tables", label: "Tables" },
  { to: "/waiter/orders", label: "Orders" },
  { to: "/waiter/statistics", label: "Statistics" },
];

function WaiterLayout() {
  return (
    <div className="layout">
      <aside>
        {WAITER_NAV.map((item) => {
          return (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          );
        })}
      </aside>
      <Outlet />
    </div>
  );
}

export default WaiterLayout;
