import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAnalytics } from "./useAnalytics";

const allDay = { id: "allDay", name: "D", startTime: "00:00", endTime: "23:59" };
const shifts = [allDay];
const attendance = [];

const employees = [
  { id: "1", name: "Zoe Reed", shiftId: "allDay", employmentDate: "2024-01-01" },
  { id: "2", name: "Tina Lawson", shiftId: "allDay", employmentDate: "2022-01-01" },
];

describe("useAnalytics", () => {
  it("survives being called before the data arrives", () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.activeShift).toBeNull();
    expect(result.current.stats.total).toBe(0);
    expect(result.current.onShiftEmployees).toEqual([]);
    expect(result.current.series).toHaveLength(2);
  });

  it("wires the active shift through to every value that depends on it", () => {
    const { result } = renderHook(() => useAnalytics(employees, shifts, attendance));

    expect(result.current.activeShift.id).toBe("allDay");
    expect(result.current.stats.onShift).toBe(2);
    expect(result.current.onShiftEmployees).toHaveLength(2);
    expect(result.current.coverage[0].count).toBe(2);
    expect(result.current.staffSplit[0].fraction).toBe(1);
  });

  it("keeps the same result object while the data does not change", () => {
    const { result, rerender } = renderHook(
      ({ list }) => useAnalytics(list, shifts, attendance),
      { initialProps: { list: employees } },
    );
    const first = result.current;

    rerender({ list: employees });

    expect(result.current).toBe(first);
  });

  it("recomputes when the data changes", () => {
    const { result, rerender } = renderHook(
      ({ list }) => useAnalytics(list, shifts, attendance),
      { initialProps: { list: employees } },
    );

    rerender({ list: employees.slice(0, 1) });

    expect(result.current.stats.total).toBe(1);
  });
});
