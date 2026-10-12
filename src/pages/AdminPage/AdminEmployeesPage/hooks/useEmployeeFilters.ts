import { useState } from "react";
import { getActiveShift } from "../../../../utils/getActiveShift";
import { getVisibleEmployees, type EmployeeFilterState } from "../utils/getVisibleEmployees";
import type { Employee, Shift } from "../../../../types/models"; 

export const INITIAL_FILTERS: EmployeeFilterState = {
  search: "",
  shiftId: "all", // "all" | "shiftA" | "shiftB"
  status: "all", // "all" | "onShift" | "idle"
  sortBy: "employmentDate", // "employmentDate" | "billingDate"
  sortDirection: "desc", // "desc" = newest first
};

export const useEmployeeFilters = (employees: Employee[] = [], shifts: Shift[] = []) => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const onFilterChange = (changes: Partial<EmployeeFilterState>) => {
    setFilters((currentFilters) => ({ ...currentFilters, ...changes }));
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

   const activeShift = getActiveShift(shifts);
   const visibleEmployees = getVisibleEmployees(employees, filters, activeShift);

   return {filters, onFilterChange, resetFilters, activeShift, visibleEmployees};
};
