import type { Employee, Shift } from "../types/models";

// Everyone, the people in the active shift, and the rest
export const getStaffCounts = (employees: Employee[], activeShift: Shift | null) => {
  const total = employees.length;
  const onShift = activeShift
    ? employees.filter((employee) => employee.shiftId === activeShift.id).length
    : 0;

  return { total, onShift, idle: total - onShift };
};
