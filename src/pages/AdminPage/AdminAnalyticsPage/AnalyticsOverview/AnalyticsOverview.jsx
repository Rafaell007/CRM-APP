import { UsersRound, Clock, Timer, Award } from "lucide-react";
import "./AnalyticsOverview.css";

const AnalyticsOverview = ({ stats, hoursThisMonth }) => {
  const { total, onShift, idle, averageTenure } = stats;

  const cards = [
    { label: "Total staff", value: total, Icon: UsersRound },
    { label: "On shift now", value: onShift, Icon: Clock, hint: `${idle} idle` },
    { label: "Hours this month", value: hoursThisMonth, Icon: Timer },
    {
      label: "Average tenure",
      value: averageTenure.toFixed(1),
      unit: "yrs",
      Icon: Award,
    },
  ];

  return (
    <>
      <h1 className="analytics-overview__title">Analytics</h1>

      <div className="analytics-overview__cards">
        {cards.map(({ label, value, unit, hint, Icon }) => (
          <div key={label} className="analytics-overview__card">
            <div className="analytics-overview__top">
              <p className="analytics-overview__label">{label}</p>
              <span className="analytics-overview__icon">
                <Icon size={16} aria-hidden="true" />
              </span>
            </div>

            <p className="analytics-overview__value">
              {value}
              {unit && <span className="analytics-overview__unit">{unit}</span>}
            </p>

            {hint && <p className="analytics-overview__hint">{hint}</p>}
          </div>
        ))}
      </div>
    </>
  );
};

export default AnalyticsOverview;
