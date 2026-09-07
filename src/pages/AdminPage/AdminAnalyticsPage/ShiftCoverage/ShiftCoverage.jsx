import "./ShiftCoverage.css";

const HOUR_MARKS = [0, 6, 12, 18, 24];

const ShiftCoverage = ({
  coverage,
  uncoveredHours,
  nowPosition,
  activeShift,
}) => {
  return (
    <section className="shift-coverage">
      <div className="shift-coverage__header">
        <h2 className="shift-coverage__title">Coverage today</h2>
        <p className="shift-coverage__note">
          {uncoveredHours > 0
            ? `${uncoveredHours} h without staff`
            : "Whole day covered"}
        </p>
      </div>

      <ul className="shift-coverage__rows">
        {coverage.map(({ id, name, startTime, endTime, count, blocks }) => (
          <li key={id} className="shift-coverage__row">
            <div className="shift-coverage__label">
              <span className="shift-coverage__name">Shift {name}</span>
              <span className="shift-coverage__time">
                {startTime} – {endTime}
              </span>
            </div>

            <div className="shift-coverage__track">
              {blocks.map(({ left, width }) => (
                <div
                  key={`${left}-${width}`}
                  className={
                    id === activeShift?.id
                      ? "shift-coverage__block shift-coverage__block--active"
                      : "shift-coverage__block"
                  }
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  <span className="shift-coverage__count">{count}</span>
                </div>
              ))}

              <span
                className="shift-coverage__now"
                style={{ left: `${nowPosition}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="shift-coverage__scale">
        <span />
        <div className="shift-coverage__marks">
          {HOUR_MARKS.map((hour) => (
            <span key={hour}>{String(hour).padStart(2, "0")}:00</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShiftCoverage;
