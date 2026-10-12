import { useQuery } from "@tanstack/react-query";
import {
  attendanceQuery,
  employeesQuery,
  shiftsQuery,
} from "../../../api/queries";
import { useAnalyticsDashboard } from "./hooks/useAnalyticsDashboard";

import AnalyticsOverview from "./AnalyticsOverview";
import AttendanceTrend from "./AttendanceTrend";
import StaffSplit from "./StaffSplit";
import ShiftCoverage from "./ShiftCoverage";
import OnShiftNow from "./OnShiftNow";

const AdminAnalyticsPage = () => {
  const {
    data: employees,
    isPending: isLoadingEmployees,
    error: employeesError,
  } = useQuery(employeesQuery);

  const {
    data: shifts,
    isPending: isLoadingShifts,
    error: shiftsError,
  } = useQuery(shiftsQuery);

  const {
    data: attendance,
    isPending: isLoadingAttendance,
    error: attendanceError,
  } = useQuery(attendanceQuery);

  const {
    activeShift,
    stats,
    hours,
    series,
    staffSplit,
    coverage,
    uncoveredHours,
    nowPosition,
    onShiftEmployees,
  } = useAnalyticsDashboard(employees, shifts, attendance);

  if (isLoadingEmployees || isLoadingShifts || isLoadingAttendance)
    return <p>Loading...</p>;

  if (employeesError || shiftsError || attendanceError)
    return (
      <p>
        Could not load the analytics{" "}
        {employeesError?.message ??
          shiftsError?.message ??
          attendanceError?.message}
      </p>
    );

  return (
    <>
      <AnalyticsOverview stats={stats} hoursThisMonth={hours.current} />

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr] lg:items-start">
        <AttendanceTrend series={series} change={hours.change} />
        <StaffSplit segments={staffSplit} total={stats.total} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ShiftCoverage
          coverage={coverage}
          uncoveredHours={uncoveredHours}
          nowPosition={nowPosition}
          activeShift={activeShift}
        />
        <OnShiftNow employees={onShiftEmployees} activeShift={activeShift} />
      </div>
    </>
  );
};

export default AdminAnalyticsPage;
