import { useState } from "react";
import { getActiveShift } from "../utils/getActiveShift";
import { getVisibleEmployees, type EmployeeFilters } from "../utils/getVisibleEmployes";
import type { Employee, Shift } from "../types/models"; 

export const INITIAL_FILTERS: EmployeeFilters = {
  search: "",
  shiftId: "all", // "all" | "shiftA" | "shiftB"
  status: "all", // "all" | "onShift" | "idle"
  sortBy: "employmentDate", // "employmentDate" | "billingDate"
  sortDirection: "desc", // "desc" = newest first
};

export const useEmployeesFilter = (employees: Employee[] = [], shifts: Shift[] = []) => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const onFilterChange = (changes: Partial<EmployeeFilters>) => {
    setFilters((currentFilters) => ({ ...currentFilters, ...changes }));
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

   const activeShift = getActiveShift(shifts);
   const visibleEmployees = getVisibleEmployees(employees, filters, activeShift);

   return {filters, onFilterChange, resetFilters, activeShift, visibleEmployees};
};
