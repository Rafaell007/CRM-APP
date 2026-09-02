export const getVisibleEmployees = (employees, filters, activeShift) => {
  const { shiftId, status, sortBy, sortDirection } = filters;

  const filtered = employees.filter((employee) => {
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
