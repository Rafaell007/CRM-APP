import type { EmployeeFilterState } from "./getVisibleEmployees";

// A <select> always gives a plain string; these check it before it reaches the filters

export const isSortDirection = (
  value: string,
): value is EmployeeFilterState["sortDirection"] =>
  value === "asc" || value === "desc";

export const isStatus = (value: string): value is EmployeeFilterState["status"] =>
  value === "all" || value === "onShift" || value === "idle";
