import { useState } from "react";
import { getActiveShift } from "../utils/getActiveShift";
import { getVisibleEmployees } from "../utils/getVisibleEmployes";

export const INITIAL_FILTERS = {
  search: "",
  shiftId: "all", // "all" | "shiftA" | "shiftB"
  status: "all", // "all" | "onShift" | "idle"
  sortBy: "employmentDate", // "employmentDate" | "billingDate"
  sortDirection: "desc", // "desc" = newest first
};

export const useEmployeesFilter = (employees = [], shifts = []) => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const onFilterChange = (changes) => {
    setFilters((currentFilters) => ({ ...currentFilters, ...changes }));
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

   const activeShift = getActiveShift(shifts);
   const visibleEmployees = getVisibleEmployees(employees, filters, activeShift);

   return {filters, onFilterChange, resetFilters, activeShift, visibleEmployees};
};
