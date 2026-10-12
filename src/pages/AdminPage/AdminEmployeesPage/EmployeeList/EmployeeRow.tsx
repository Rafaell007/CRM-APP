import { useState } from "react";
import { formatDate } from "../utils/formatDate";
import { ChevronDown, Plus } from "lucide-react";
import type { Employee } from "../../../../types/models";

const SHIFT_COLORS: Record<string, string> = {
  a: "bg-amber-400",
  b: "bg-blue-300",
};

// On mobile the row is a 3-column card (person, shift, toggle) and the details
// open below it. From lg the details become direct grid cells of the table row.
const RESET_PLACEMENT = "lg:col-auto lg:row-auto lg:justify-self-auto";
const DETAILS_OPEN = "col-span-full mt-1 flex flex-col items-start gap-2 border-t border-border pt-2.5";

interface EmployeeRowProps {
  employee: Employee;
}

const EmployeeRow = ({ employee }: EmployeeRowProps) => {
  const { avatar, name, email, shift, employmentDate, billingDate } = employee;
  const [isOpen, setIsOpen] = useState(false);
  const shiftColor = shift ? (SHIFT_COLORS[shift.name.toLowerCase()] ?? "") : "";

  return (
    <li className="grid grid-cols-[1fr_auto_auto] items-center gap-2.5 rounded-lg bg-surface p-3 lg:grid-cols-employees lg:gap-4 lg:bg-transparent lg:px-4 lg:odd:bg-surface">
      <div className={`col-start-1 row-start-1 flex items-center gap-3 ${RESET_PLACEMENT}`}>
        <img className="size-10 rounded-full bg-subtle object-cover" src={avatar} alt="" />
        <div>
          <p className="text-base font-semibold">{name}</p>
          <p className="mt-0.5 text-sm text-muted">{email}</p>
        </div>
      </div>

      {shift && (
        <span
          className={`col-start-2 row-start-1 flex size-7.5 items-center justify-center justify-self-end rounded-full text-sm leading-none font-semibold text-white ${RESET_PLACEMENT} ${shiftColor}`}
        >
          {shift.name}
        </span>
      )}
      <button
        className="group col-start-3 row-start-1 flex size-8 items-center justify-center text-ink lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle details"
      >
        <ChevronDown
          className="transition-transform duration-200 group-aria-expanded:rotate-180"
          size={18}
          aria-hidden="true"
        />
      </button>
      <div className={`${isOpen ? DETAILS_OPEN : "hidden"} lg:contents`}>
        <span className="text-base">
          <span className="text-muted lg:hidden">{"Employment date: "}</span>
          {formatDate(employmentDate)}
        </span>
        <span className="text-base">
          <span className="text-muted lg:hidden">{"Billing date: "}</span>
          {formatDate(billingDate)}
        </span>
        <button
          className="flex size-8 items-center justify-center rounded-full bg-subtle text-ink hover:bg-subtle-strong"
          aria-label="Add bonus"
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};

export default EmployeeRow;
