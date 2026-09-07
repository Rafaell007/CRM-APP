import { useState } from "react";
import { ListFilter, Search } from "lucide-react";
import "./EmployeeFilters.css";

const EmployeeFilters = ({
  shifts,
  filters,
  onFilterChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getSortValue = (field) =>
    filters.sortBy === field ? filters.sortDirection : "";

  const handleSortChange = (field, direction) => {
    if (!direction) return;
    onFilterChange({ sortBy: field, sortDirection: direction });
  };

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

        <div
          className={`employee-search ${isSearchOpen ? "employee-search--open" : ""}`}
        >
          <input
            className="employee-search__input"
            type="search"
            placeholder="Search employees"
            aria-label="Search employees"
            value={filters.search}
            onChange={(event) => {
              onFilterChange({search: event.target.value})
            }}
          />
          <button
            className="employee-search__button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-expanded={isSearchOpen}
            aria-label="Search employees"
          >
            <Search size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className={`employee-filters ${isOpen ? "employee-filters--open" : ""}`}
      >
        <div className="employee-filters__clip">
          <div className="employee-filters__box">
            <label className="employee-filters__field">
              <span className="employee-filter__label">Shift</span>
              <select
                className="employee-filter__control"
                value={filters.shiftId}
                onChange={(event) => {
                  onFilterChange({ shiftId: event.target.value });
                }}
              >
                 <option value="all">All shifts</option>
                {shifts.map((shift) => (
                  <option value={shift.id} key={shift.id}>
                    Shift {shift.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="employee-filters__field">
              <span className="employee-filter__label">Employment date</span>
              <select
                className="employee-filter__control"
                value={getSortValue("employmentDate")}
                onChange={(event) => {
                  handleSortChange("employmentDate", event.target.value);
                }}
              >
                <option value="">Not sorted</option>
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </label>

            <label className="employee-filters__field">
              <span className="employee-filter__label">Billing date</span>
              <select
                className="employee-filter__control"
                value={getSortValue("billingDate")}
                onChange={(event) => {
                  handleSortChange("billingDate", event.target.value);
                }}
              >
                <option value="">Not sorted</option>
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </label>

            <label className="employee-filters__field">
              <span className="employee-filter__label">Status</span>
              <select
                className="employee-filter__control"
                value={filters.status}
                onChange={(event) => {
                  onFilterChange({ status: event.target.value });
                }}
              >
                <option value="all">Everyone</option>
                <option value="onShift">On shift</option>
                <option value="idle">Idle</option>
              </select>
            </label>

            <button
              type="button"
              className="employee-filters__clear"
              onClick={onReset}
            >
              Clear all
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeFilters;
