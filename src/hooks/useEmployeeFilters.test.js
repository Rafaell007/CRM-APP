import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useEmployeesFilter, INITIAL_FILTERS } from "./useEmployeeFilters";

describe("useEmployeesFilter", () => {
  it("starts with the default filters", () => {
    const { result } = renderHook(() => useEmployeesFilter());
    expect(result.current.filters).toEqual(INITIAL_FILTERS);
  });

  it("survives being called before the data arrives", () => {
    const { result } = renderHook(() => useEmployeesFilter());
    expect(result.current.visibleEmployees).toEqual([]);
    expect(result.current.activeShift).toBeNull();
  });

  it("merges a change instead of replacing the whole object", () => {
    const { result } = renderHook(() => useEmployeesFilter());

    act(() => result.current.onFilterChange({ status: "idle" }));

    expect(result.current.filters.status).toBe("idle");
    expect(result.current.filters.shiftId).toBe("all"); // untouched
    expect(result.current.filters.sortBy).toBe("employmentDate");
  });

  it("can change two fields at once", () => {
    const { result } = renderHook(() => useEmployeesFilter());

    act(() =>
      result.current.onFilterChange({
        sortBy: "billingDate",
        sortDirection: "asc",
      }),
    );

    expect(result.current.filters.sortBy).toBe("billingDate");
    expect(result.current.filters.sortDirection).toBe("asc");
  });

  it("resets every field back to the defaults", () => {
    const { result } = renderHook(() => useEmployeesFilter());

    act(() => result.current.onFilterChange({ status: "idle", search: "zoe" }));
    act(() => result.current.resetFilters());

    expect(result.current.filters).toEqual(INITIAL_FILTERS);
  });

  it("passes the active shift through to the visible list", () => {
    const shifts = [
      { id: "shiftA", name: "A", startTime: "00:00", endTime: "23:59" },
    ];
    const employees = [{ id: "1", name: "Zoe Reed", shiftId: "shiftA",
      employmentDate: "2021-03-25T00:00:00.000Z",
      billingDate: "2023-01-13T00:00:00.000Z" }];

    const { result } = renderHook(() => useEmployeesFilter(employees, shifts));

    expect(result.current.activeShift.id).toBe("shiftA");
    expect(result.current.visibleEmployees).toHaveLength(1);
  });
});
