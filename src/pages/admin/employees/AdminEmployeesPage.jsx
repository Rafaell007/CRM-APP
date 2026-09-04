
import { useGetEmployeesQuery, useGetShiftsQuery } from "../../../services/api";
import { useEmployeesFilter } from "../../../hooks/useEmployeeFilters";

import EmployeeSummary from "./summary/EmployeeSummary";
import EmployeeList from "./list/EmployeeList";
import EmployeeFilters from "./filters/EmployeeFilters";

const AdminEmployeesPage = () => {
  const {
    data: employees,
    isLoading: isLoadingEmployees,
    error: employeesError,
  } = useGetEmployeesQuery();

  const {
    data: shifts,
    isLoading: isLoadingShifts,
    error: shiftsError,
  } = useGetShiftsQuery();

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

      <EmployeeList
        employees={visibleEmployees}
      >
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
