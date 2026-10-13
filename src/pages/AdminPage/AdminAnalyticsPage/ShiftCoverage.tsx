import type { ShiftCoverageRow } from "./utils/getAnalytics";
import type { Shift } from "../../../types/models";

const HOUR_MARKS = [0, 6, 12, 18, 24];

const ROW_GRID = "grid grid-cols-[92px_1fr] items-center gap-3";

const BLOCK = "absolute top-0 flex h-full items-center justify-center rounded-lg";
const BLOCK_ACTIVE = `${BLOCK} bg-ink text-white`;
const BLOCK_IDLE = `${BLOCK} bg-chart-bar`;

interface ShiftCoverageProps {
  coverage: ShiftCoverageRow[];
  uncoveredHours: number;
  nowPosition: number; // % of the day that has passed
  activeShift: Shift | null;
}

const ShiftCoverage = ({
  coverage,
  uncoveredHours,
  nowPosition,
  activeShift,
}: ShiftCoverageProps) => {
  return (
    <section className="rounded-xl bg-panel px-6 py-5">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h2 className="text-md font-bold">Coverage today</h2>
        <p className="text-xs font-semibold text-muted">
          {uncoveredHours > 0
            ? `${uncoveredHours} h without staff`
            : "Whole day covered"}
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {coverage.map(({ id, name, startTime, endTime, count, blocks }) => {
          const blockClassName = id === activeShift?.id ? BLOCK_ACTIVE : BLOCK_IDLE;

          return (
            <li key={id} className={ROW_GRID}>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">Shift {name}</span>
                <span className="text-2xs text-muted">
                  {startTime} – {endTime}
                </span>
              </div>

              <div className="relative h-8.5 rounded-lg bg-surface">
                {blocks.map(({ left, width }) => (
                  <div
                    key={`${left}-${width}`}
                    className={blockClassName}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  >
                    <span className="text-xs font-bold">{count}</span>
                  </div>
                ))}

                <span
                  className="absolute -top-1.25 -bottom-1.25 w-0.5 rounded-xs bg-danger"
                  style={{ left: `${nowPosition}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <div className={`${ROW_GRID} mt-2.5`}>
        <span />
        <div className="flex justify-between text-2xs text-muted">
          {HOUR_MARKS.map((hour) => (
            <span key={hour}>{String(hour).padStart(2, "0")}:00</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShiftCoverage;
