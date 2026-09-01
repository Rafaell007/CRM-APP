import { EmployeeRow } from "./EmployeeRow";
import EmployeeFilters from "./EmployeeFilters";

const AdminEmployeeList = ({ employees, shiftsById }) => {
  return (
    <section className="employee-list">
      <EmployeeFilters />

      <div className="employee-list__scroll">
        <div className="employee-list__head">
          <span>Employee</span>
          <span>Shift</span>
          <span>Employment date</span>
          <span>Billing date</span>
          <span>Bonus</span>
        </div>

        <ul className="employee-list__rows">
          {employees.map((employee) => {
            return (
              <EmployeeRow
                key={employee.id}
                employee={employee}
                shift={shiftsById.get(employee.shiftId)}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default AdminEmployeeList;
