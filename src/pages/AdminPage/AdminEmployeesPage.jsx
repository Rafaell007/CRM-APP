import { useGetEmployeesQuery } from "../../services/api";
import "./AdminEmployeesPage.css";
import AdminSummary from "./AdminSummary";
import AdminEmployeeList from "./AdminEmployeeList";

const AdminEmployeesPage = () => {
  const { data: employees, isLoading, error } = useGetEmployeesQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Could not load the employees {error.message}</p>;

  return (
    <>
      <AdminSummary employees={employees} />
      <AdminEmployeeList employees={employees} />
    </>
  );
};

export default AdminEmployeesPage;
