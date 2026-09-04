import { useState } from "react";
import { formatDate } from "../../../../utils/formatDate";
import { ChevronDown, Plus } from "lucide-react";
import "./EmployeeRow.css";

const EmployeeRow = ({employee: { avatar, name, email, shift, employmentDate, billingDate} }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      className={`employee-list__row ${isOpen ? "employee-list__row--open" : ""}`}
    >
      <div className="employee-list__person">
        <img className="employee-list__avatar" src={avatar} alt="" />
        <div>
          <p className="employee-list__name">{name}</p>
          <p className="employee-list__email">{email}</p>
        </div>
      </div>

      {shift && (
        <span
          className={`employee-list__shift employee-list__shift--${shift.name.toLowerCase()}`}
        >
          {shift.name}
        </span>
      )}
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
          {formatDate(employmentDate)}
        </span>
        <span className="employee-list__date" data-label="Billing date">
          {formatDate(billingDate)}
        </span>
        <button className="employee-list__bonus" aria-label="Add bonus">
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};

export default EmployeeRow;
