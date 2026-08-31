import { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { ChevronDown, Plus } from "lucide-react";

export const EmployeeRow = ({ employee }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      className={`employee-list__row ${isOpen ? "employee-list__row--open" : ""}`}
    >
      <div className="employee-list__person">
        <img className="employee-list__avatar" src={employee.avatar} alt="" />
        <div>
          <p className="employee-list__name">{employee.name}</p>
          <p className="employee-list__email">{employee.email}</p>
        </div>
      </div>

      <span
        className={`employee-list__shift employee-list__shift--${employee.shift.toLowerCase()}`}
      >
        {employee.shift}
      </span>
      <button
        className="employee-list__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle details"
      >
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <div className="employee-list__details">
        <span className="employee-list__date" data-label="Employment date">
          {formatDate(employee.employmentDate)}
        </span>
        <span className="employee-list__date" data-label="Billing date">
          {formatDate(employee.billingDate)}
        </span>
        <button className="employee-list__bonus" aria-label="Add bonus">
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};
