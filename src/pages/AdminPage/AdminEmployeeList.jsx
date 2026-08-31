import { ListFilter, Search, Plus } from "lucide-react";

import { EmployeeRow } from "./EmployeeRow";

const AdminEmployeeList = ({employees}) => {
  return (
    <section className="employee-list">
      <div className="employee-list__toolbar">
        <button className="employee-list__filters">
          <ListFilter size={16} aria-hidden="true" />
          Filters
        </button>
        <button className="employee-list__search" aria-label="Search employees">
          <Search size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="employee-list__scroll">
        <div className="employee-list__head">
          <span>Employee</span>
          <span>Shift</span>
          <span>Employment date</span>
          <span>Billing date</span>
          <span>Bonus</span>
        </div>

        <ul className="employee-list__rows" >
          {employees.map((employee)=>{
            return (
                <EmployeeRow employee = {employee} key={employee.id} />
            )
          })}
        
        </ul>
      </div>
    </section>
  );
};

export default AdminEmployeeList;
