import { useGetEmployeesQuery } from "../services/api"

const AdminEmployeesPage = () => {
  
const { data:employees, isLoading, error } = useGetEmployeesQuery();

if (isLoading) return <p>Loading...</p>;
if (error) return <p>Could not load the employees {error.message}</p>;
     
  return (
    <ul>
      {employees.map((employee) => (
        <li key={employee.id}>
          <p>
            employee nr {employee.name}-{employee.shift} seats {employee.email}
          </p>
        </li>
      ))}
    </ul>
  )
}

export default AdminEmployeesPage