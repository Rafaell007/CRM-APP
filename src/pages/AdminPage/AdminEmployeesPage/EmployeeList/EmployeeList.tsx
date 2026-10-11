import EmployeeRow from "./EmployeeRow";
import type { Employee } from "../../../../types/models";
import type { ReactNode } from "react";

interface EmployeeListProps {
  employees: Employee[];
  children: ReactNode;
}

const EmployeeList = ({ employees, children }: EmployeeListProps) => {
  return (
    <section className="mt-6 scroll-mt-4 rounded-xl bg-panel p-3">
      {children}

      <div className="overflow-x-auto">
        <div className="hidden items-center gap-4 px-4 pb-2.5 text-sm text-muted lg:grid lg:grid-cols-employees">
          <span>Employee</span>
          <span>Shift</span>
          <span>Employment date</span>
          <span>Billing date</span>
          <span>Bonus</span>
        </div>

        <ul className="flex flex-col gap-2 lg:gap-0">
          {employees.map((employee) => {
            return <EmployeeRow key={employee.id} employee={employee} />;
          })}
        </ul>
      </div>
    </section>
  );
};

export default EmployeeList;
