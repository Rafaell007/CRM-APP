import { describe, it, expect } from "vitest";
import {
  getAnalytics,
  getShiftCoverage,
  getUncoveredHours,
  getNowPosition,
  getOnShiftEmployees,
  getStaffSplit,
  getMonthlySeries,
  getHoursSummary,
} from "./getAnalytics";

// 7 September 2026, 12:00 local time - every test runs on this clock
const NOW = new Date(2026, 8, 7, 12, 0);

const shiftA = { id: "shiftA", name: "A", startTime: "06:00", endTime: "14:00" };
const shiftB = { id: "shiftB", name: "B", startTime: "14:00", endTime: "22:00" };
const nightShift = { id: "night", name: "N", startTime: "22:00", endTime: "06:00" };

const employees = [
  { id: "1", name: "Zoe Reed", shiftId: "shiftA", employmentDate: "2024-09-07" },
  { id: "2", name: "Tina Lawson", shiftId: "shiftB", employmentDate: "2022-09-07" },
  { id: "3", name: "Hugo Bauer", shiftId: "shiftA", employmentDate: "2020-09-07" },
];

const idsOf = (list) => list.map((item) => item.id);

describe("getAnalytics", () => {
  it("counts everyone, then splits by the active shift", () => {
    const stats = getAnalytics(employees, shiftA, NOW);

    expect(stats.total).toBe(3);
    expect(stats.onShift).toBe(2);
    expect(stats.idle).toBe(1);
  });

  it("treats everybody as idle when no shift is running", () => {
    const stats = getAnalytics(employees, null, NOW);

    expect(stats.onShift).toBe(0);
    expect(stats.idle).toBe(3);
  });

  it("averages tenure in years", () => {
    // hired 2, 4 and 6 years ago -> average 4
    expect(getAnalytics(employees, null, NOW).averageTenure).toBeCloseTo(4, 1);
  });

  it("skips employees without an employment date", () => {
    const withMissing = [...employees, { id: "4", shiftId: "shiftA" }];

    expect(getAnalytics(withMissing, null, NOW).averageTenure).toBeCloseTo(4, 1);
  });

  it("returns zeros for an empty list", () => {
    expect(getAnalytics([], shiftA, NOW)).toEqual({
      total: 0,
      onShift: 0,
      idle: 0,
      averageTenure: 0,
    });
  });
});

describe("getShiftCoverage", () => {
  it("places a normal window as one block, in percent of the day", () => {
    const [coverage] = getShiftCoverage(employees, [shiftA]);

    expect(coverage.count).toBe(2);
    expect(coverage.blocks).toEqual([{ left: 25, width: (8 / 24) * 100 }]);
  });

  it("splits a shift that crosses midnight into two blocks", () => {
    const [coverage] = getShiftCoverage([], [nightShift]);

    expect(coverage.blocks).toEqual([
      { left: (22 / 24) * 100, width: (2 / 24) * 100 },
      { left: 0, width: 25 },
    ]);
  });

  it("does not create an empty block for a shift ending at midnight", () => {
    const [coverage] = getShiftCoverage([], [
      { id: "late", name: "L", startTime: "12:00", endTime: "00:00" },
    ]);

    expect(coverage.blocks).toEqual([{ left: 50, width: 50 }]);
  });
});

describe("getUncoveredHours", () => {
  it("finds the gap between shifts", () => {
    // 06-14 and 14-22 leave 22-06 uncovered = 8 hours
    expect(getUncoveredHours([shiftA, shiftB])).toBe(8);
  });

  it("returns zero when the whole day is covered", () => {
    expect(getUncoveredHours([shiftA, shiftB, nightShift])).toBe(0);
  });

  it("does not count overlapping shifts twice", () => {
    const overlap = { id: "x", name: "X", startTime: "08:00", endTime: "12:00" };

    expect(getUncoveredHours([shiftA, overlap])).toBe(16);
  });

  it("is a full day when there are no shifts", () => {
    expect(getUncoveredHours([])).toBe(24);
  });
});

describe("getNowPosition", () => {
  it("maps the time of day onto 0-100", () => {
    expect(getNowPosition(new Date(2026, 8, 7, 0, 0))).toBe(0);
    expect(getNowPosition(new Date(2026, 8, 7, 12, 0))).toBe(50);
    expect(getNowPosition(new Date(2026, 8, 7, 18, 0))).toBe(75);
  });
});

describe("getOnShiftEmployees", () => {
  it("returns the people assigned to the active shift", () => {
    expect(idsOf(getOnShiftEmployees(employees, shiftA))).toEqual(["1", "3"]);
  });

  it("returns nobody when no shift is running", () => {
    expect(getOnShiftEmployees(employees, null)).toEqual([]);
  });
});

describe("getStaffSplit", () => {
  it("gives each shift its share of the donut, one after another", () => {
    const [first, second] = getStaffSplit(employees, [shiftA, shiftB]);

    expect(first).toMatchObject({ id: "shiftA", count: 2, fraction: 2 / 3, startFraction: 0 });
    expect(second).toMatchObject({ id: "shiftB", count: 1, fraction: 1 / 3, startFraction: 2 / 3 });
  });

  it("adds a slice for employees without a shift", () => {
    const withUnassigned = [...employees, { id: "4", name: "New Hire" }];
    const segments = getStaffSplit(withUnassigned, [shiftA, shiftB]);

    expect(segments).toHaveLength(3);
    expect(segments[2]).toMatchObject({ id: "unassigned", count: 1, fraction: 1 / 4 });
  });

  it("has no unassigned slice when everyone has a shift", () => {
    expect(idsOf(getStaffSplit(employees, [shiftA, shiftB]))).toEqual(["shiftA", "shiftB"]);
  });

  it("does not divide by zero with no employees", () => {
    const [segment] = getStaffSplit([], [shiftA]);

    expect(segment.fraction).toBe(0);
  });
});

describe("getMonthlySeries", () => {
  const attendance = [
    { year: 2026, monthIndex: 0, hours: 1000 },
    { year: 2026, monthIndex: 8, hours: 1300 },
    { year: 2025, monthIndex: 8, hours: 1200 },
  ];

  it("puts the current year first, the previous year second", () => {
    const [current, previous] = getMonthlySeries(attendance, NOW);

    expect(current.year).toBe(2026);
    expect(previous.year).toBe(2025);
  });

  it("fills the twelve month slots and leaves missing months as null", () => {
    const [current] = getMonthlySeries(attendance, NOW);

    expect(current.values).toHaveLength(12);
    expect(current.values[0]).toBe(1000);
    expect(current.values[8]).toBe(1300);
    expect(current.values[1]).toBeNull();
    expect(current.values[11]).toBeNull();
  });

  it("returns two empty years when there are no records", () => {
    const [current, previous] = getMonthlySeries([], NOW);

    expect(current.values.every((value) => value === null)).toBe(true);
    expect(previous.values.every((value) => value === null)).toBe(true);
  });
});

describe("getHoursSummary", () => {
  it("compares this month with the same month last year", () => {
    const attendance = [
      { year: 2026, monthIndex: 8, hours: 1320 },
      { year: 2025, monthIndex: 8, hours: 1200 },
    ];

    expect(getHoursSummary(attendance, NOW)).toEqual({ current: 1320, change: 10 });
  });

  it("reports a drop as a negative percentage", () => {
    const attendance = [
      { year: 2026, monthIndex: 8, hours: 900 },
      { year: 2025, monthIndex: 8, hours: 1200 },
    ];

    expect(getHoursSummary(attendance, NOW).change).toBe(-25);
  });

  it("has nothing to compare against without last year's month", () => {
    const attendance = [{ year: 2026, monthIndex: 8, hours: 1320 }];

    expect(getHoursSummary(attendance, NOW)).toEqual({ current: 1320, change: null });
  });

  it("shows zero hours for a month with no record", () => {
    expect(getHoursSummary([], NOW).current).toBe(0);
  });
});
