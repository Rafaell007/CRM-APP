import type { ReactNode } from "react";
import EmployeeRow from "./EmployeeRow";
import { employeeColumns, type EmployeeColumn } from "./employeeColumns";
import type { Employee } from "../../types/models";

const ALL_COLUMNS: EmployeeColumn[] = [
  employeeColumns.person,
  employeeColumns.shift,
  employeeColumns.employmentDate,
  employeeColumns.billingDate,
];

interface EmployeeTableProps {
  employees: Employee[];
  /** What is shown — ready-made `employeeColumns.*` and/or your own. Default: all */
  columns?: EmployeeColumn[];
  toolbar?: ReactNode;
  /** false = no own background/padding, for use inside another panel */
  framed?: boolean;
  className?: string;
}

const EmployeeTable = ({
  employees,
  columns = ALL_COLUMNS,
  toolbar,
  framed = true,
  className = "",
}: EmployeeTableProps) => {
  const cardColumns = columns.filter((column) => column.mobile === "card");
  const detailColumns = columns.filter((column) => column.mobile !== "card");
  const orderedColumns = [...cardColumns, ...detailColumns];

  // Widths come from the columns, so they are known only at runtime → inline style
  const gridTemplateColumns = orderedColumns
    .map((column) => column.width ?? "1fr")
    .join(" ");

  const frame = framed ? "rounded-xl bg-panel p-3" : "";

  return (
    <section className={`flex flex-col ${frame} ${className}`}>
      {toolbar && <div className="sticky top-0 z-20 bg-panel">{toolbar}</div>}

      <div className="min-h-0 flex-1 overflow-auto">
        <div
          className="sticky top-0 z-10 hidden items-center gap-4 bg-panel px-4 pb-2.5 text-sm text-muted lg:grid"
          style={{ gridTemplateColumns }}
        >
          {orderedColumns.map((column) => (
            <span key={column.id}>{column.header}</span>
          ))}
        </div>

        <ul className="flex flex-col gap-2 lg:gap-0">
          {employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              cardColumns={cardColumns}
              detailColumns={detailColumns}
              gridTemplateColumns={gridTemplateColumns}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EmployeeTable;
