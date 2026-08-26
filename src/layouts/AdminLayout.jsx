import { NavLink, Outlet } from "react-router";

const ADMIN_NAV = [
  { to: "/admin/home", label: "Home" },
  { to: "/admin/shift", label: "Shift" },
  { to: "/admin/payroll", label: "Payroll" },
  { to: "/admin/tasks", label: "Tasks" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/employees", label: "Employees" },
  { to: "/admin/vacation", label: "Vacation" },
  { to: "/admin/sick-days", label: "Sick days" },
];
const AdminLayout = () => {
  return (
    <>
      <div className="layout">
        <aside>
          {ADMIN_NAV.map((item) => {
            return (
              <NavLink key={item.to} to={item.to} className="">
                {item.label}
              </NavLink>
            );
          })}
        </aside>
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
