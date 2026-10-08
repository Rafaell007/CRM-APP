import { useQuery } from "@tanstack/react-query";
import { employeesQuery, shiftsQuery } from "../../../services/queries";
import { useEmployeesFilter } from "../../../hooks/useEmployeeFilters";

import EmployeeSummary from "./EmployeeSummary/EmployeeSummary";
import EmployeeList from "./EmployeeList/EmployeeList";
import EmployeeFilters from "./EmployeeFilters/EmployeeFilters";

const AdminEmployeesPage = () => {
  // Default to [] so the children always get a list, even before the data arrives
  const {
    data: employees = [],
    isPending: isLoadingEmployees,
    error: employeesError,
  } = useQuery(employeesQuery);

  const {
    data: shifts = [],
    isPending: isLoadingShifts,
    error: shiftsError,
  } = useQuery(shiftsQuery);

  const {
    filters,
    onFilterChange,
    resetFilters,
    visibleEmployees,
    activeShift,
  } = useEmployeesFilter(employees, shifts);

  if (isLoadingEmployees || isLoadingShifts) return <p>Loading...</p>;
  if (employeesError || shiftsError)
    return (
      <p>
        Could not load the employees{" "}
        {employeesError?.message ?? shiftsError?.message}
      </p>
    );

  return (
    <>
      <EmployeeSummary
        employees={employees}
        activeShift={activeShift}
        onReset={resetFilters}
        onFilterChange={onFilterChange}
      />

      <EmployeeList employees={visibleEmployees}>
        <EmployeeFilters
          shifts={shifts}
          filters={filters}
          onFilterChange={onFilterChange}
          onReset={resetFilters}
        />
      </EmployeeList>
    </>
  );
};

export default AdminEmployeesPage;
