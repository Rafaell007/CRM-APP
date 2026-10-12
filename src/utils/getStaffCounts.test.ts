import { describe, it, expect } from "vitest";
import { getStaffCounts } from "./getStaffCounts";
import type { Employee, Shift } from "../types/models";
import { makeEmployee } from "../test/factories";

const shiftA: Shift = { id: "shiftA", name: "A", startTime: "06:00", endTime: "14:00" };

const employees: Employee[] = [
  makeEmployee({ id: "1", shiftId: "shiftA" }),
  makeEmployee({ id: "2", shiftId: "shiftB" }),
  makeEmployee({ id: "3", shiftId: "shiftA" }),
];

describe("getStaffCounts", () => {
  it("counts everyone, then splits by the active shift", () => {
    expect(getStaffCounts(employees, shiftA)).toEqual({ total: 3, onShift: 2, idle: 1 });
  });

  it("treats everybody as idle when no shift is running", () => {
    expect(getStaffCounts(employees, null)).toEqual({ total: 3, onShift: 0, idle: 3 });
  });

  it("returns zeros for an empty list", () => {
    expect(getStaffCounts([], shiftA)).toEqual({ total: 0, onShift: 0, idle: 0 });
  });
});
