import "./EmployeeSummary.css";
import { getAnalytics } from "../../../../utils/getAnalytics";
import type { Employee, Shift } from "../../../../types/models";
import type { EmployeeFilters } from "../../../../utils/getVisibleEmployes";

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
      <h1 className="employee-summary__title">Employees</h1>
      <div className="employee-summary__cards">
        {summary.map(({ label, value, onClick }) => (
          <div key={label} className="employee-summary__card">
            <p className="employee-summary__label">{label}</p>
            <div className="employee-summary__row">
              <span className="employee-summary__count">{value}</span>
              <span className="employee-summary__line" />
              <button className="employee-summary__button" onClick={onClick}>
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
