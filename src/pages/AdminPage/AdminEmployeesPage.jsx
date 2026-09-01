import { useGetEmployeesQuery, useGetShiftsQuery } from "../../services/api";
import { getActiveShift } from "../../utils/getActiveShift";
import "./AdminEmployeesPage.css";
import AdminSummary from "./AdminSummary";
import AdminEmployeeList from "./AdminEmployeeList";

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

  if (isLoadingEmployees || isLoadingShifts) return <p>Loading...</p>;
  if (employeesError || shiftsError)
    return (
      <p>
        Could not load the employees{" "}
        {employeesError?.message ?? shiftsError?.message}
      </p>
    );
  const activeShift = getActiveShift(shifts);
  const shiftsById = new Map(shifts.map((shift) => [shift.id, shift]));

  return (
    <>
      <AdminSummary employees={employees} activeShift={activeShift} />
      <AdminEmployeeList employees={employees} shiftsById={shiftsById} />
    </>
  );
};

export default AdminEmployeesPage;
