import type { EmployeeFilterState } from "./getVisibleEmployees";

export const isSortDirection = (
  value: string,
): value is EmployeeFilterState["sortDirection"] =>
  value === "asc" || value === "desc";

export const isStatus = (value: string): value is EmployeeFilterState["status"] =>
  value === "all" || value === "onShift" || value === "idle";
