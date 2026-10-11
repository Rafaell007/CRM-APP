import { useState } from "react";
import { ListFilter, Search } from "lucide-react";
import Collapse from "../../../components/Collapse";
import type { Shift } from "../../../types/models";
import type { EmployeeFilters } from "../../../utils/getVisibleEmployees";
import { isSortDirection, isStatus } from "../../../utils/filterGuards";

const FIELD = "flex flex-[1_1_160px] flex-col gap-1.5";
const LABEL = "text-xs font-semibold text-muted";
const SELECT =
  "rounded-md border border-border bg-surface px-2.5 py-2 text-md text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink";

interface EmployeeFiltersProps {
  shifts: Shift[];
  filters: EmployeeFilters;
  onFilterChange: (changes: Partial<EmployeeFilters>) => void;
  onReset: () => void;
}

const EmployeeFilters = ({
  shifts,
  filters,
  onFilterChange,
  onReset,
}: EmployeeFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getSortValue = (field: EmployeeFilters["sortBy"]) =>
    filters.sortBy === field ? filters.sortDirection : "";

  const handleSortChange = (
    field: EmployeeFilters["sortBy"],
    direction: EmployeeFilters["sortDirection"],
  ) => {
    onFilterChange({ sortBy: field, sortDirection: direction });
  };

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <button
          className="flex items-center gap-2 rounded-lg bg-subtle px-3.5 py-2 text-md text-ink"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <ListFilter size={16} aria-hidden="true" />
          Filters
        </button>

        <div className="flex h-9.5 items-center rounded-lg bg-surface">
          <input
            className={`text-md text-ink transition-[width,padding] duration-250 focus:outline-none ${isSearchOpen ? "w-45 pr-1 pl-3.5" : "w-0"}`}
            type="search"
            placeholder="Search employees"
            aria-label="Search employees"
            value={filters.search}
            onChange={(event) => {
              onFilterChange({ search: event.target.value });
            }}
          />
          <button
            className="flex size-9.5 shrink-0 items-center justify-center rounded-lg text-ink"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-expanded={isSearchOpen}
            aria-label="Search employees"
          >
            <Search size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Collapse isOpen={isOpen}>
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-3 rounded-lg bg-surface p-4">
          <label className={FIELD}>
            <span className={LABEL}>Shift</span>
            <select
              className={SELECT}
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
  
          <label className={FIELD}>
            <span className={LABEL}>Employment date</span>
            <select
              className={SELECT}
              value={getSortValue("employmentDate")}
              onChange={(event) => {
                if (isSortDirection(event.target.value)) {
                  handleSortChange("employmentDate", event.target.value);
                }
              }}
            >
              <option value="">Not sorted</option>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </label>
  
          <label className={FIELD}>
            <span className={LABEL}>Billing date</span>
            <select
              className={SELECT}
              value={getSortValue("billingDate")}
              onChange={(event) => {
                if (isSortDirection(event.target.value)) {
                  handleSortChange("billingDate", event.target.value);
                }
              }}
            >
              <option value="">Not sorted</option>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </label>
  
          <label className={FIELD}>
            <span className={LABEL}>Status</span>
            <select
              className={SELECT}
              value={filters.status}
              onChange={(event) => {
                if (isStatus(event.target.value)) {
                  onFilterChange({ status: event.target.value });
                }
              }}
            >
              <option value="all">Everyone</option>
              <option value="onShift">On shift</option>
              <option value="idle">Idle</option>
            </select>
          </label>
  
          <button
            type="button"
            className="ml-auto shrink-0 self-end rounded-md border border-border px-3.5 py-2 text-md text-ink hover:bg-subtle"
            onClick={onReset}
          >
            Clear all
          </button>
        </div>
      </Collapse>
    </>
  );
};

export default EmployeeFilters;
