import { getAnalytics } from "../../../utils/getAnalytics";
import type { Employee, Shift } from "../../../types/models";
import type { EmployeeFilters } from "../../../utils/getVisibleEmployees";

interface EmployeeSummaryProps {
  employees: Employee[];
  activeShift: Shift | null;
  onReset: () => void;
  onFilterChange: (changes: Partial<EmployeeFilters>) => void;
}

const EmployeeSummary = ({
  employees,
  activeShift,
  onReset,
  onFilterChange,
}: EmployeeSummaryProps) => {
  const { total, onShift, idle } = getAnalytics(employees, activeShift);

  const summary = [
    { label: "All Employees", value: total, onClick: onReset },
    {
      label: "On Shift",
      value: onShift,
      onClick: () => onFilterChange({ status: "onShift" }),
    },
    {
      label: "Idle",
      value: idle,
      onClick: () => onFilterChange({ status: "idle" }),
    },
  ];

  return (
    <>
      <h1 className="mb-5 text-xl font-bold">Employees</h1>
      <div className="flex flex-col gap-4 md:flex-row">
        {summary.map(({ label, value, onClick }) => (
          <div key={label} className="rounded-xl bg-panel px-6 py-5 md:flex-1">
            <p className="mb-3 text-xs font-semibold text-muted">{label}</p>
            <div className="flex items-center gap-4">
              <span className="text-6xl leading-none font-bold tracking-number">{value}</span>
              <span className="h-px flex-1 bg-ink" />
              <button
                className="rounded-md bg-surface px-4.5 py-2 text-md text-ink hover:bg-subtle"
                onClick={onClick}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EmployeeSummary;
