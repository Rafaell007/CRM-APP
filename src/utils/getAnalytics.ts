import type { Attendance, Employee, Shift } from "../types/models";

const MINUTES_PER_DAY = 24 * 60;
const MILLISECONDS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const tenureInYears = (employmentDate: string, now: Date): number =>
  (now.getTime() - new Date(employmentDate).getTime()) / MILLISECONDS_PER_YEAR;

const toRanges = (startTime: string, endTime: string): [number, number][] => {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  const ranges: [number, number][] =
    start < end
      ? [[start, end]]
      : [
          [start, MINUTES_PER_DAY],
          [0, end],
        ];

  // "12:00"-"00:00" produces an empty second range - drop it
  return ranges.filter(([from, to]) => to > from);
};

export const getAnalytics = (
  employees: Employee[] = [],
  activeShift: Shift | null = null,
  now = new Date(),
) => {
  const total = employees.length;

  const onShift = activeShift
    ? employees.filter((employee) => employee.shiftId === activeShift.id).length
    : 0;

  const tenures = employees.map((employee) =>
    tenureInYears(employee.employmentDate, now),
  );

  const averageTenure = tenures.length
    ? tenures.reduce((sum, tenure) => sum + tenure, 0) / tenures.length
    : 0;

  return {
    total,
    onShift,
    idle: total - onShift,
    averageTenure,
  };
};

export const getShiftCoverage = (
  employees: Employee[] = [],
  shifts: Shift[] = [],
) =>
  shifts.map((shift) => ({
    id: shift.id,
    name: shift.name,
    startTime: shift.startTime,
    endTime: shift.endTime,
    count: employees.filter((employee) => employee.shiftId === shift.id).length,
    blocks: toRanges(shift.startTime, shift.endTime).map(([from, to]) => ({
      left: (from / MINUTES_PER_DAY) * 100,
      width: ((to - from) / MINUTES_PER_DAY) * 100,
    })),
  }));

// Hours of the day that no shift covers - the gap a manager has to fill.
export const getUncoveredHours = (shifts: Shift[] = []): number => {
  const coveredMinutes = new Array(MINUTES_PER_DAY).fill(false);

  shifts.forEach((shift) => {
    toRanges(shift.startTime, shift.endTime).forEach(([from, to]) => {
      for (let minute = from; minute < to; minute += 1) {
        coveredMinutes[minute] = true;
      }
    });
  });

  return coveredMinutes.filter((covered) => !covered).length / 60;
};

export const getNowPosition = (now = new Date()) =>
  ((now.getHours() * 60 + now.getMinutes()) / MINUTES_PER_DAY) * 100;

export const getOnShiftEmployees = (
  employees: Employee[] = [],
  activeShift: Shift | null = null,
) =>
  activeShift
    ? employees.filter((employee) => employee.shiftId === activeShift.id)
    : [];

export const getStaffSplit = (
  employees: Employee[] = [],
  shifts: Shift[] = [],
) => {
  const perShift = shifts.map((shift) => ({
    id: shift.id,
    label: `Shift ${shift.name}`,
    count: employees.filter((employee) => employee.shiftId === shift.id).length,
  }));

  const unassigned = employees.filter((employee) => !employee.shiftId).length;

  const segments =
    unassigned > 0
      ? [
          ...perShift,
          { id: "unassigned", label: "No shift", count: unassigned },
        ]
      : perShift;

  // Each slice of the donut needs to know where the previous one ended.
  const total = employees.length;
  let usedFraction = 0;

  return segments.map((segment) => {
    const startFraction = usedFraction;
    const fraction = total ? segment.count / total : 0;
    usedFraction += fraction;

    return { ...segment, fraction, startFraction };
  });
};

// One line per year, twelve slots each. A month with no record stays null
export const getMonthlySeries = (
  attendance: Attendance[] = [],
  now = new Date(),
) => {
  const buildYear = (year: number) => {
    const values: (number | null)[] = new Array(12).fill(null);

    attendance
      .filter((record) => record.year === year)
      .forEach((record) => {
        values[record.monthIndex] = record.hours;
      });

    return { year, values };
  };

  return [buildYear(now.getFullYear()), buildYear(now.getFullYear() - 1)];
};

export const getHoursSummary = (
  attendance: Attendance[] = [],
  now = new Date(),
) => {
  const findHours = (year: number, monthIndex: number): number =>
    attendance.find(
      (record) => record.year === year && record.monthIndex === monthIndex,
    )?.hours ?? 0;

  const current = findHours(now.getFullYear(), now.getMonth());
  const lastYear = findHours(now.getFullYear() - 1, now.getMonth());

  return {
    current,
    // null = nothing to compare against, so the UI hides the badge
    change: lastYear ? ((current - lastYear) / lastYear) * 100 : null,
  };
};

// Types derived from the functions above, so they never drift from the real data
export type AnalyticsStats = ReturnType<typeof getAnalytics>;
export type ShiftCoverageRow = ReturnType<typeof getShiftCoverage>[number];
export type StaffSplitSegment = ReturnType<typeof getStaffSplit>[number];
export type YearSeries = ReturnType<typeof getMonthlySeries>[number];
