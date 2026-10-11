import { UsersRound, Clock, Timer, Award } from "lucide-react";
import type { AnalyticsStats } from "../../../../utils/getAnalytics";

interface AnalyticsOverviewProps {
  stats: AnalyticsStats;
  hoursThisMonth: number;
}

const AnalyticsOverview = ({ stats, hoursThisMonth }: AnalyticsOverviewProps) => {
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
      <h1 className="mb-5 text-xl font-bold">Analytics</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map(({ label, value, unit, hint, Icon }) => (
          <div key={label} className="rounded-xl bg-ink px-5 py-4.5 text-white">
            <div className="mb-4.5 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-muted-light">{label}</p>
              <span className="flex size-7 items-center justify-center rounded-lg bg-raised-dark">
                <Icon size={16} aria-hidden="true" />
              </span>
            </div>

            <p className="flex items-baseline gap-1.5 text-4xl leading-none font-bold tracking-number md:text-5xl">
              {value}
              {unit && (
                <span className="text-md font-semibold tracking-normal text-muted-light">
                  {unit}
                </span>
              )}
            </p>

            {hint && <p className="mt-2 text-2xs font-semibold text-muted-light">{hint}</p>}
          </div>
        ))}
      </div>
    </>
  );
};

export default AnalyticsOverview;
