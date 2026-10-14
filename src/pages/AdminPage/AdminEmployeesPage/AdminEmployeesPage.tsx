import { useQuery } from "@tanstack/react-query";
import { employeesQuery, shiftsQuery } from "../../../api/queries";
import { useEmployeeFilters } from "./hooks/useEmployeeFilters";
import Table from "../../../components/Table/Table";
import { allEmployeeColumns, toEmployeeRows } from "../employeeColumns";

import EmployeeSummary from "./EmployeeSummary";
import EmployeeFilters from "./EmployeeFilters";

const AdminEmployeesPage = () => {
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
  } = useEmployeeFilters(employees, shifts);

  if (isLoadingEmployees || isLoadingShifts) return <p>Loading...</p>;
  if (employeesError || shiftsError)
    return (
      <p>
        Could not load the employees{" "}
        {employeesError?.message ?? shiftsError?.message}
      </p>
    );

  return (
    <div className="flex flex-col md:h-full">
      <EmployeeSummary
        employees={employees}
        activeShift={activeShift}
        onReset={resetFilters}
        onFilterChange={onFilterChange}
      />

      <Table
        columns={allEmployeeColumns}
        rows={toEmployeeRows(visibleEmployees)}
        className="mt-6 md:min-h-80 md:flex-1"
        toolbar={
          <EmployeeFilters
            shifts={shifts}
            filters={filters}
            onFilterChange={onFilterChange}
            onReset={resetFilters}
          />
        }
      />
    </div>
  );
};

export default AdminEmployeesPage;
