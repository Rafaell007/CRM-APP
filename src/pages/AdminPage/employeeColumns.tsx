import { formatDate } from "../../utils/formatDate";
import type { DataTableColumn } from "../../components/DataTable/types";
import type { Employee } from "../../types/models";

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
  },
  shift: {
    id: "shift",
    header: "Shift",
    mobile: "card",
    cell: (employee) =>
      employee.shift && (
        <span
          className={`flex size-7.5 items-center justify-center rounded-full text-sm leading-none font-semibold text-white ${SHIFT_COLORS[employee.shift.name.toLowerCase()] ?? ""}`}
        >
          <span className="[text-box:trim-both_cap_alphabetic]">
            {employee.shift.name}
          </span>
        </span>
      ),
  },
  employmentDate: {
    id: "employmentDate",
    header: "Employment date",
    cell: (employee) => formatDate(employee.employmentDate),
  },
  billingDate: {
    id: "billingDate",
    header: "Billing date",
    cell: (employee) => formatDate(employee.billingDate),
  },
} satisfies Record<string, DataTableColumn<Employee>>;

export const allEmployeeColumns: DataTableColumn<Employee>[] =
  Object.values(employeeColumns);
