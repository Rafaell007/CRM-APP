import type { ReactNode } from "react";
import { formatDate } from "../../utils/formatDate";
import type { TableColumn } from "../../components/Table/Table";
import type { Employee } from "../../types/models";

export const employeeColumns = {
  person: {
    id: "person",
    header: "Employee",
    width: "minmax(220px, 1fr)",
    mobile: "card",
  },
  shift: { id: "shift", header: "Shift", width: "80px", mobile: "card" },
  employmentDate: {
    id: "employmentDate",
    header: "Employment date",
    width: "170px",
  },
  billingDate: { id: "billingDate", header: "Billing date", width: "170px" },
} as const satisfies Record<string, TableColumn>;

type EmployeeColumnId = keyof typeof employeeColumns;

export const allEmployeeColumns: TableColumn<EmployeeColumnId>[] =
  Object.values(employeeColumns);

const SHIFT_COLORS: Record<string, string> = {
  a: "bg-amber-400",
  b: "bg-blue-300",
};

export const getEmployeeCells = (
  employee: Employee,
): Record<EmployeeColumnId, ReactNode> => ({
  person: (
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
  shift: employee.shift && (
    <span
      className={`flex size-7.5 items-center justify-center rounded-full text-sm leading-none font-semibold text-white ${SHIFT_COLORS[employee.shift.name.toLowerCase()] ?? ""}`}
    >
      {employee.shift.name}
    </span>
  ),
  employmentDate: formatDate(employee.employmentDate),
  billingDate: formatDate(employee.billingDate),
});

export const toEmployeeRows = (employees: Employee[]) =>
  employees.map((employee) => ({
    id: employee.id,
    cells: getEmployeeCells(employee),
  }));
