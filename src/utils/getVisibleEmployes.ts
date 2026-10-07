import type { Employee, Shift } from "../types/models";

export interface EmployeeFilters {
  search: string;
  shiftId: string;                           // "all" or a shift id
  status: "all" | "onShift" | "idle";
  sortBy: "employmentDate" | "billingDate";
  sortDirection: "asc" | "desc";
}

export const getVisibleEmployees = (employees: Employee[], filters: EmployeeFilters, activeShift: Shift | null) => {
  const { search ,shiftId, status, sortBy, sortDirection } = filters;

  const searchText = search.trim().toLowerCase();
  const filtered = employees.filter((employee) => {
    if (searchText && !employee.name.toLowerCase().includes(searchText)) return false;
    if (shiftId !== "all" && employee.shiftId !== shiftId) return false;
    if (status === "onShift" && employee.shiftId !== activeShift?.id)
      return false;
    if (status === "idle" && employee.shiftId === activeShift?.id) return false;
    return true;
  });
  return filtered.sort((firstEmployee, secondEmployee) => {
    const comparison = firstEmployee[sortBy].localeCompare(
      secondEmployee[sortBy],
    );
    return sortDirection === "asc" ? comparison : -comparison;
  });
};



