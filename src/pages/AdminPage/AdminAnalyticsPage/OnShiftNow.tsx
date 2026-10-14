import { useState } from "react";
import { ChevronDown, UsersRound } from "lucide-react";
import Collapse from "../../../components/Collapse";
import DataTable from "../../../components/DataTable/DataTable";
import { toDataTableRows } from "../../../components/DataTable/utils/toDataTableRows";
import { employeeColumns } from "../employeeColumns";
import type { Employee, Shift } from "../../../types/models";

const COLUMNS = [employeeColumns.person];

interface OnShiftNowProps {
  employees: Employee[];
  activeShift: Shift | null;
}

const OnShiftNow = ({ employees, activeShift }: OnShiftNowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const summaryLabel = `${employees.length} ${employees.length === 1 ? "person" : "people"} on shift`;

  return (
    <section className="rounded-xl bg-panel px-6 py-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-md font-bold">Working now</h2>
        {activeShift && (
          <span className="rounded-full bg-ink px-2.5 py-0.75 text-2xs font-semibold text-white">
            Shift {activeShift.name}
          </span>
        )}
      </div>

      {employees.length === 0 ? (
        <p className="py-10 text-center text-muted">Nobody is on shift right now</p>
      ) : (
        <>
          <button
            type="button"
            className="group flex w-full items-center gap-3 rounded-lg bg-surface px-3 py-2.5 transition-colors hover:bg-subtle focus:outline-none focus-visible:outline-2 focus-visible:outline-ink"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
          >
            <UsersRound className="shrink-0" size={18} aria-hidden="true" />
            <span className="text-md font-semibold">{summaryLabel}</span>
            <span className="ml-auto text-xs font-semibold text-muted">
              {isOpen ? "Hide list" : "Show list"}
            </span>
            <ChevronDown
              className="shrink-0 transition-transform duration-250 group-aria-expanded:rotate-180"
              size={18}
              aria-hidden="true"
            />
          </button>

          <Collapse isOpen={isOpen}>
            <DataTable
              columns={COLUMNS}
              rows={toDataTableRows(employees, COLUMNS)}
              framed={false}
              className="mt-2 max-h-80"
            />
          </Collapse>
        </>
      )}
    </section>
  );
};

export default OnShiftNow;
