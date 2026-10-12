import { TrendingUp, TrendingDown } from "lucide-react";
import type { YearSeries } from "./utils/getAnalytics";

const WIDTH = 640;
const HEIGHT = 200;
const PADDING = 14;

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// series[0] is the current year (solid), series[1] the year before (dashed, muted)
const YEAR_STYLES = [
  { dot: "bg-ink", line: { className: "stroke-ink", strokeWidth: 2.5 } },
  {
    dot: "bg-chart-muted",
    line: { className: "stroke-chart-muted", strokeWidth: 2, strokeDasharray: "5 5" },
  },
];

// Months with no record are skipped, so the line stops instead of
// dropping to zero for a year that is still running.
const toPath = (values: YearSeries["values"], highest: number): string =>
  values
    .flatMap((value, index) => {
      if (value === null) return [];

      const x = (index / (values.length - 1)) * WIDTH;
      const y = HEIGHT - PADDING - (value / highest) * (HEIGHT - PADDING * 2);
      return [`${x.toFixed(1)},${y.toFixed(1)}`];
    })
    // SVG path: "M" moves to the first point, "L" draws a line to each next one
    .map((point, index) => `${index === 0 ? "M" : "L"}${point}`)
    .join(" ");

interface AttendanceTrendProps {
  series: YearSeries[];
  change: number | null; // % vs the same month last year, null = nothing to compare
}

const AttendanceTrend = ({ series, change }: AttendanceTrendProps) => {
  const allValues = series.flatMap(({ values }) =>
    values.filter((value) => value !== null),
  );
  const highest = Math.max(...allValues, 1);
  const hasChange = change !== null;
  const isUp = hasChange && change >= 0;

  return (
    <section className="rounded-xl bg-panel px-6 py-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="mb-1.5 text-md font-bold">Staff hours per month</h2>
          {hasChange && (
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <span
                className={`inline-flex items-center gap-1 font-bold ${isUp ? "text-success" : "text-danger"}`}
              >
                {isUp ? (
                  <TrendingUp size={14} aria-hidden="true" />
                ) : (
                  <TrendingDown size={14} aria-hidden="true" />
                )}
                {isUp ? "+" : ""}
                {change.toFixed(1)}%
              </span>
              vs the same month last year
            </p>
          )}
        </div>

        <ul className="flex gap-3.5">
          {series.map(({ year }, index) => (
            <li key={year} className="flex items-center gap-1.5 text-xs text-muted">
              <span className={`size-2 rounded-full ${YEAR_STYLES[index].dot}`} />
              {year}
            </li>
          ))}
        </ul>
      </div>

      {allValues.length === 0 ? (
        <p className="py-15 text-center text-muted">No attendance records yet</p>
      ) : (
        <>
          <svg
            className="h-50 w-full"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            role="img"
            aria-label="Staff hours per month"
          >
            {[0.25, 0.5, 0.75].map((step) => (
              <line
                key={step}
                x1="0"
                x2={WIDTH}
                y1={HEIGHT * step}
                y2={HEIGHT * step}
                className="stroke-border"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {series.map(({ year, values }, index) => (
              <path
                key={year}
                d={toPath(values, highest)}
                {...YEAR_STYLES[index].line}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <div className="mt-2 flex justify-between text-2xs text-muted">
            {MONTH_LABELS.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default AttendanceTrend;
