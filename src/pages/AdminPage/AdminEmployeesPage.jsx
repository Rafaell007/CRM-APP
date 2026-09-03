import { useRef } from "react";
import { useGetEmployeesQuery, useGetShiftsQuery } from "../../services/api";
import { useEmployeesFilter } from "../../hooks/useEmployeeFilters";
import "./AdminEmployeesPage.css";
import AdminSummary from "./AdminSummary";
import AdminEmployeeList from "./AdminEmployeeList";
import { EmployeeFilters } from './EmployeeFilters'



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

   const { filters, onFilterChange, resetFilters, visibleEmployees, activeShift } =
    useEmployeesFilter(employees, shifts);

  // holds the real <section> element so the summary cards can scroll to it
  const listRef = useRef(null);

  const scrollToList = () =>
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (isLoadingEmployees || isLoadingShifts) return <p>Loading...</p>;
  if (employeesError || shiftsError)
    return (
      <p>
        Could not load the employees{" "}
        {employeesError?.message ?? shiftsError?.message}
      </p>
    );

  const shiftsById = new Map(shifts.map((shift) => [shift.id, shift]));

  return (
    <>
      <AdminSummary employees={employees}
       activeShift={activeShift}
      onReset = {resetFilters}
        onFilterChange = {onFilterChange}
        onScrollToList = {scrollToList}
         />

      <AdminEmployeeList employees={visibleEmployees} shiftsById={shiftsById} listRef={listRef} >
              <EmployeeFilters
                shifts = {shifts}
                filters = { filters }
                onFilterChange = {onFilterChange}
                onReset = {resetFilters}
              />
      </AdminEmployeeList>
    </>
  );
};

export default AdminEmployeesPage;
