import type { Employee, Shift } from "../../../types/models";

interface OnShiftNowProps {
  employees: Employee[];
  activeShift: Shift | null;
}

const OnShiftNow = ({ employees, activeShift }: OnShiftNowProps) => {
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
        <ul className="flex flex-col gap-2">
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
      )}
    </section>
  );
};

export default OnShiftNow;
