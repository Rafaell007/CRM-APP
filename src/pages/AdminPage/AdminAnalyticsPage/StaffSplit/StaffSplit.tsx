import "./StaffSplit.css";
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
    <section className="staff-split">
      <h2 className="staff-split__title">Staff per shift</h2>

      {total === 0 ? (
        <p className="staff-split__empty">No employees yet</p>
      ) : (
        <>
          <div className="staff-split__chart">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Staff per shift">
              <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
                {segments.map(({ id, fraction, startFraction }, index) => {
                  const length = fraction * CIRCUMFERENCE;

                  return (
                    <circle
                      key={id}
                      className="staff-split__arc"
                      cx={CENTER}
                      cy={CENTER}
                      r={RADIUS}
                      stroke={shadeAt(index)}
                      strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                      strokeDashoffset={-startFraction * CIRCUMFERENCE}
                    />
                  );
                })}
              </g>
            </svg>

            <div className="staff-split__center">
              <span className="staff-split__total">{total}</span>
              <span className="staff-split__caption">staff</span>
            </div>
          </div>

          <ul className="staff-split__legend">
            {segments.map(({ id, label, count }, index) => (
              <li key={id} className="staff-split__legend-item">
                <span
                  className="staff-split__dot"
                  style={{ backgroundColor: shadeAt(index) }}
                />
                <span className="staff-split__label">{label}</span>
                <span className="staff-split__count">{count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default StaffSplit;
