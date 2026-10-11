import { useState } from "react";
import { ChevronDown, UsersRound } from "lucide-react";
import Collapse from "../../../components/Collapse";
import type { Employee, Shift } from "../../../types/models";

interface OnShiftNowProps {
  employees: Employee[];
  activeShift: Shift | null;
}

const OnShiftNow = ({ employees, activeShift }: OnShiftNowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const summaryLabel = `${employees.length} ${employees.length === 1 ? "person" : "people"} on shift`;

  return (
    <section className="rounded-xl bg-panel px-6 py-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-md font-bold">Working now</h2>
        {activeShift && (
          <span className="rounded-full bg-ink px-2.5 py-0.75 text-2xs font-semibold text-white">
            Shift {activeShift.name}
          </span>
        )}
      </div>

      {employees.length === 0 ? (
        <p className="py-10 text-center text-muted">Nobody is on shift right now</p>
      ) : (
        <>
          <button
            type="button"
            className="group flex w-full items-center gap-3 rounded-lg bg-surface px-3 py-2.5 transition-colors hover:bg-subtle focus:outline-none focus-visible:outline-2 focus-visible:outline-ink"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
          >
            <UsersRound className="shrink-0" size={18} aria-hidden="true" />
            <span className="text-md font-semibold">{summaryLabel}</span>
            <span className="ml-auto text-xs font-semibold text-muted">
              {isOpen ? "Hide list" : "Show list"}
            </span>
            <ChevronDown
              className="shrink-0 transition-transform duration-250 group-aria-expanded:rotate-180"
              size={18}
              aria-hidden="true"
            />
          </button>

          <Collapse isOpen={isOpen}>
            <ul className="mt-2 flex max-h-80 flex-col gap-2 overflow-y-auto">
              {employees.map(({ id, avatar, name, email }) => (
                <li key={id} className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2.5">
                  <img className="size-9 rounded-full object-cover" src={avatar} alt="" />
                  <div>
                    <p className="text-md font-semibold">{name}</p>
                    <p className="text-xs text-muted">{email}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Collapse>
        </>
      )}
    </section>
  );
};

export default OnShiftNow;
