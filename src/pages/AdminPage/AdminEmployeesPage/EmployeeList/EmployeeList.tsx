import "./EmployeeList.css";
import EmployeeRow from "./EmployeeRow";
import type { Employee } from "../../../../types/models";
import type { ReactNode } from "react";

interface EmployeeListProps {
  employees: Employee[];
  children: ReactNode;
}

const EmployeeList = ({ employees, children }: EmployeeListProps) => {
  return (
    <section className="employee-list">
      {children}

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
            return <EmployeeRow key={employee.id} employee={employee} />;
          })}
        </ul>
      </div>
    </section>
  );
};

export default EmployeeList;
