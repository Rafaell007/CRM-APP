import type { StaffSplitSegment } from "../../../../utils/getAnalytics";

const SIZE = 160;
const CENTER = SIZE / 2;
const RADIUS = 62;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SHADES = ["#1a1a1a", "#6b6b6b", "#a3a3a3", "#d6d6d6"];

// More segments than shades -> the colours repeat
const shadeAt = (index: number) => SHADES[index % SHADES.length];

interface StaffSplitProps {
  segments: StaffSplitSegment[];
  total: number;
}

const StaffSplit = ({ segments, total }: StaffSplitProps) => {
  return (
    <section className="rounded-xl bg-panel px-6 py-5">
      <h2 className="mb-5 text-md font-bold">Staff per shift</h2>

      {total === 0 ? (
        <p className="py-10 text-center text-muted">No employees yet</p>
      ) : (
        <>
          <div className="relative mx-auto w-40">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Staff per shift">
              <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
                {segments.map(({ id, fraction, startFraction }, index) => {
                  const length = fraction * CIRCUMFERENCE;

                  return (
                    <circle
                      key={id}
                      cx={CENTER}
                      cy={CENTER}
                      r={RADIUS}
                      fill="none"
                      stroke={shadeAt(index)}
                      strokeWidth={22}
                      strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                      strokeDashoffset={-startFraction * CIRCUMFERENCE}
                    />
                  );
                })}
              </g>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
              <span className="text-3xl leading-none font-bold tracking-number">{total}</span>
              <span className="text-2xs font-semibold text-muted">staff</span>
            </div>
          </div>

          <ul className="mt-5 flex flex-col gap-2.5">
            {segments.map(({ id, label, count }, index) => (
              <li key={id} className="flex items-center gap-2.5 text-sm">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: shadeAt(index) }}
                />
                <span className="text-ink-soft">{label}</span>
                <span className="ml-auto font-bold">{count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default StaffSplit;
