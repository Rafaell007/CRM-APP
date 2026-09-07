import { TrendingUp, TrendingDown } from "lucide-react";
import "./AttendanceTrend.css";

const WIDTH = 640;
const HEIGHT = 200;
const PADDING = 14;

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Months with no record are skipped, so the line stops instead of
// dropping to zero for a year that is still running.
const toPath = (values, highest) => {
  let started = false;

  return values
    .reduce((path, value, index) => {
      if (value === null) return path;

      const x = (index / (values.length - 1)) * WIDTH;
      const y = HEIGHT - PADDING - (value / highest) * (HEIGHT - PADDING * 2);
      const command = started ? "L" : "M";
      started = true;

      return `${path}${command}${x.toFixed(1)},${y.toFixed(1)} `;
    }, "")
    .trim();
};

const AttendanceTrend = ({ series, change }) => {
  const allValues = series.flatMap(({ values }) =>
    values.filter((value) => value !== null),
  );
  const highest = Math.max(...allValues, 1);
  const hasChange = change !== null;
  const isUp = hasChange && change >= 0;

  return (
    <section className="attendance-trend">
      <div className="attendance-trend__header">
        <div>
          <h2 className="attendance-trend__title">Staff hours per month</h2>
          {hasChange && (
            <p className="attendance-trend__note">
              <span
                className={
                  isUp
                    ? "attendance-trend__change"
                    : "attendance-trend__change attendance-trend__change--down"
                }
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

        <ul className="attendance-trend__legend">
          {series.map(({ year }, index) => (
            <li key={year} className="attendance-trend__legend-item">
              <span
                className={
                  index === 0
                    ? "attendance-trend__dot"
                    : "attendance-trend__dot attendance-trend__dot--muted"
                }
              />
              {year}
            </li>
          ))}
        </ul>
      </div>

      {allValues.length === 0 ? (
        <p className="attendance-trend__empty">No attendance records yet</p>
      ) : (
        <>
          <svg
            className="attendance-trend__svg"
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
                className="attendance-trend__grid"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {series.map(({ year, values }, index) => (
              <path
                key={year}
                d={toPath(values, highest)}
                className={
                  index === 0
                    ? "attendance-trend__line"
                    : "attendance-trend__line attendance-trend__line--muted"
                }
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <div className="attendance-trend__months">
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
