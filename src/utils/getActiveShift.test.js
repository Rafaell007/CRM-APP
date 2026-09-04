import { describe, it, expect } from "vitest";
import { getActiveShift } from "./getActiveShift";

const shifts = [
  { id: "shiftA", name: "A", startTime: "06:00", endTime: "14:00" },
  { id: "shiftB", name: "B", startTime: "14:00", endTime: "22:00" },
];

describe("getActiveShift", () => {
  it("returns the shift whose window contains the current time", () => {
    expect(getActiveShift(shifts, "10:30").id).toBe("shiftA");
    expect(getActiveShift(shifts, "15:00").id).toBe("shiftB");
  });

  it("counts startTime as inside the window and endTime as outside", () => {
    expect(getActiveShift(shifts, "06:00").id).toBe("shiftA");
    expect(getActiveShift(shifts, "13:59").id).toBe("shiftA");
    // 14:00 belongs to B, not to A — the windows must not overlap
    expect(getActiveShift(shifts, "14:00").id).toBe("shiftB");
  });

  it("returns null when no shift is running", () => {
    expect(getActiveShift(shifts, "22:00")).toBeNull();
    expect(getActiveShift(shifts, "03:00")).toBeNull();
  });

  it("handles a window that crosses midnight", () => {
    const nightShift = [
      { id: "night", name: "N", startTime: "22:00", endTime: "06:00" },
    ];

    expect(getActiveShift(nightShift, "22:00").id).toBe("night");
    expect(getActiveShift(nightShift, "23:30").id).toBe("night");
    expect(getActiveShift(nightShift, "02:00").id).toBe("night");
    expect(getActiveShift(nightShift, "05:59").id).toBe("night");

    expect(getActiveShift(nightShift, "06:00")).toBeNull();
    expect(getActiveShift(nightShift, "12:00")).toBeNull();
  });

  it("returns null for an empty list of shifts", () => {
    expect(getActiveShift([], "10:00")).toBeNull();
  });

  it("returns the first match when windows overlap", () => {
    const overlapping = [
      { id: "first", startTime: "08:00", endTime: "16:00" },
      { id: "second", startTime: "10:00", endTime: "18:00" },
    ];

    expect(getActiveShift(overlapping, "12:00").id).toBe("first");
  });
});
