import { useState } from "react";
import { ListFilter } from "lucide-react";

const EmployeeFilters = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="employee-list__toolbar">
        <button
          className="employee-list__filters"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <ListFilter size={16} aria-hidden="true" />
          Filters
        </button>
      </div>

      <div
        className={`employee-filters ${isOpen ? "employee-filters--open" : ""}`}
      >
        <div className="employee-filters__clip">
          <div className="employee-filters__box">
            <label className="employee-filters__field">
              <span className="employee-filter__label">Shift</span>
              <select className="employee-filter__control">
                <option>All shifts</option>
                <option>Shift A</option>
                <option>Shift B</option>
              </select>
            </label>

            <label className="employee-filters__field">
              <span className="employee-filter__label">Employment date</span>
              <select className="employee-filter__control">
                <option>Not sorted</option>
                <option>Newest first</option>
                <option>Oldest first</option>
              </select>
            </label>

            <label className="employee-filters__field">
              <span className="employee-filter__label">Billing date</span>
              <select className="employee-filter__control">
                <option>Not sorted</option>
                <option>Newest first</option>
                <option>Oldest first</option>
              </select>
            </label>

            <label className="employee-filters__field">
              <span className="employee-filter__label">Status</span>
              <select className="employee-filter__control">
                <option>Everyone</option>
                <option>On shift</option>
                <option>Idle</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeFilters;
