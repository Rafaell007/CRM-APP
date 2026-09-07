import { useMemo } from "react";
import { getActiveShift } from "../utils/getActiveShift";
import {
  getAnalytics,
  getShiftCoverage,
  getUncoveredHours,
  getNowPosition,
  getOnShiftEmployees,
  getStaffSplit,
  getMonthlySeries,
  getHoursSummary,
} from "../utils/getAnalytics";

export const useAnalytics = (employees = [], shifts = [], attendance = []) =>
  useMemo(() => {
    const activeShift = getActiveShift(shifts);

    return {
      activeShift,
      stats: getAnalytics(employees, activeShift),
      hours: getHoursSummary(attendance),
      series: getMonthlySeries(attendance),
      staffSplit: getStaffSplit(employees, shifts),
      coverage: getShiftCoverage(employees, shifts),
      uncoveredHours: getUncoveredHours(shifts),
      nowPosition: getNowPosition(),
      onShiftEmployees: getOnShiftEmployees(employees, activeShift),
    };
  }, [employees, shifts, attendance]);
