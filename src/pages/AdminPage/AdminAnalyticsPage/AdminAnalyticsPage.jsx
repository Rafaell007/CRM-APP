import {
  useGetEmployeesQuery,
  useGetShiftsQuery,
  useGetAttendanceQuery,
} from "../../../services/api";
import { useAnalytics } from "../../../hooks/useAnalytics";

import AnalyticsOverview from "./AnalyticsOverview/AnalyticsOverview";
import AttendanceTrend from "./AttendanceTrend/AttendanceTrend";
import StaffSplit from "./StaffSplit/StaffSplit";
import ShiftCoverage from "./ShiftCoverage/ShiftCoverage";
import OnShiftNow from "./OnShiftNow/OnShiftNow";
import "./AdminAnalyticsPage.css";

const AdminAnalyticsPage = () => {
  const {
    data: employees,
    isLoading: isLoadingEmployees,
    error: employeesError,
  } = useGetEmployeesQuery();

  const {
    data: shifts,
    isLoading: isLoadingShifts,
    error: shiftsError,
  } = useGetShiftsQuery();

  const {
    data: attendance,
    isLoading: isLoadingAttendance,
    error: attendanceError,
  } = useGetAttendanceQuery();

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
  } = useAnalytics(employees, shifts, attendance);

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

      <div className="admin-analytics__panels admin-analytics__panels--wide">
        <AttendanceTrend series={series} change={hours.change} />
        <StaffSplit segments={staffSplit} total={stats.total} />
      </div>

      <div className="admin-analytics__panels">
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
