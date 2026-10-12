import EmployeeRow from "./EmployeeRow";
import type { Employee } from "../../../../types/models";
import type { ReactNode } from "react";

interface EmployeeListProps {
  employees: Employee[];
  children: ReactNode;
}

const EmployeeList = ({ employees, children }: EmployeeListProps) => {
  // From md the table fills the space the page gives it (min 20rem, so a
  // short window never squeezes it) and only the rows scroll
  return (
    <section className="mt-6 flex scroll-mt-4 flex-col rounded-xl bg-panel p-3 md:min-h-80 md:flex-1">
      {/* Filters stay visible: above the rows' scroll area on desktop,
          stuck to the top of the screen when the whole page scrolls (mobile) */}
      <div className="sticky top-0 z-20 bg-panel">{children}</div>

      <div className="overflow-auto md:min-h-0 md:flex-1">
        <div className="sticky top-0 z-10 hidden items-center gap-4 bg-panel px-4 pb-2.5 text-sm text-muted lg:grid lg:grid-cols-employees">
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
