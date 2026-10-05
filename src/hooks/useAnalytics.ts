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

// Created once, so the useMemo dependencies stay stable while the data is loading
const NO_EMPLOYEES: Employee[] = [];
const NO_SHIFTS: Shift[] = [];
const NO_ATTENDANCE: Attendance[] = [];

export const useAnalytics = (
  employees: Employee[] = NO_EMPLOYEES,
  shifts: Shift[] = NO_SHIFTS,
  attendance: Attendance[] = NO_ATTENDANCE,
) =>
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
