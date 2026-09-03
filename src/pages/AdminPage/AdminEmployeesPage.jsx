
import { useGetEmployeesQuery, useGetShiftsQuery } from "../../services/api";
import { useEmployeesFilter } from "../../hooks/useEmployeeFilters";
import "./AdminEmployeesPage.css";
import AdminSummary from "./AdminSummary";
import AdminEmployeeList from "./AdminEmployeeList";
import { EmployeeFilters } from "./EmployeeFilters";

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
      <AdminSummary
        employees={employees}
        activeShift={activeShift}
        onReset={resetFilters}
        onFilterChange={onFilterChange}
      />

      <AdminEmployeeList
        employees={visibleEmployees}
      >
        <EmployeeFilters
          shifts={shifts}
          filters={filters}
          onFilterChange={onFilterChange}
          onReset={resetFilters}
        />
      </AdminEmployeeList>
    </>
  );
};

export default AdminEmployeesPage;
