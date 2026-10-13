import type { ReactNode } from "react";
import { formatDate } from "../../utils/formatDate";
import type { Employee } from "../../types/models";

export interface EmployeeColumn {
  id: string;

  header: string;
  cell: (employee: Employee) => ReactNode;

  width?: string;
  /** "card" = always visible on mobile, "details" (default) = shown when the row is opened */
  mobile?: "card" | "details";
}

const SHIFT_COLORS: Record<string, string> = {
  a: "bg-amber-400",
  b: "bg-blue-300",
};

export const employeeColumns = {
  person: {
    id: "person",
    header: "Employee",
    cell: (employee) => (
      <div className="flex items-center gap-3">
        <img
          className="size-10 rounded-full bg-subtle object-cover"
          src={employee.avatar}
          alt=""
        />
        <div>
          <p className="text-base font-semibold">{employee.name}</p>
          <p className="mt-0.5 text-sm text-muted">{employee.email}</p>
        </div>
      </div>
    ),
    width: "minmax(220px, 1fr)",
    mobile: "card",
  },
  shift: {
    id: "shift",
    header: "Shift",
    cell: (employee) =>
      employee.shift && (
        <span
          className={`flex size-7.5 items-center justify-center rounded-full text-sm leading-none font-semibold text-white ${SHIFT_COLORS[employee.shift.name.toLowerCase()] ?? ""}`}
        >
          {employee.shift.name}
        </span>
      ),
    width: "80px",
    mobile: "card",
  },
  employmentDate: {
    id: "employmentDate",
    header: "Employment date",
    cell: (employee) => formatDate(employee.employmentDate),
    width: "170px",
  },
  billingDate: {
    id: "billingDate",
    header: "Billing date",
    cell: (employee) => formatDate(employee.billingDate),
    width: "170px",
  },
} satisfies Record<string, EmployeeColumn>;
