import type { EmployeeFilters } from "./getVisibleEmployes";

// A <select> always gives a plain string; these check it before it reaches the filters

export const isSortDirection = (
  value: string,
): value is EmployeeFilters["sortDirection"] =>
  value === "asc" || value === "desc";

export const isStatus = (value: string): value is EmployeeFilters["status"] =>
  value === "all" || value === "onShift" || value === "idle";
