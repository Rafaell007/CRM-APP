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

import type { Employee, Attendance, Shift } from "../types/models";

export const useAnalytics = (employees: Employee[] = [], shifts:Shift[] = [], attendance:Attendance[] = []) =>
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
