import { describe, it, expect } from "vitest";
import { getVisibleEmployees } from "./getVisibleEmployes";

const shiftA = { id: "shiftA", name: "A", startTime: "06:00", endTime: "14:00" };

const employees = [
  {
    id: "1",
    name: "Zoe Reed",
    shiftId: "shiftA",
    employmentDate: "2021-03-25T00:00:00.000Z",
    billingDate: "2023-01-13T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Tina Lawson",
    shiftId: "shiftB",
    employmentDate: "2020-06-05T00:00:00.000Z",
    billingDate: "2023-03-09T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Hugo Bauer",
    shiftId: "shiftA",
    employmentDate: "2022-11-14T00:00:00.000Z",
    billingDate: "2023-02-17T00:00:00.000Z",
  },
];

const DEFAULT_FILTERS = {
  search: "",
  shiftId: "all",
  status: "all",
  sortBy: "employmentDate",
  sortDirection: "desc",
};

// small helper so each test only states what it changes
const run = (changes = {}, activeShift = shiftA) =>
  getVisibleEmployees(employees, { ...DEFAULT_FILTERS, ...changes }, activeShift);

const idsOf = (list) => list.map((employee) => employee.id);

describe("getVisibleEmployees", () => {
  describe("search", () => {
    it("matches part of the name, ignoring case", () => {
      expect(idsOf(run({ search: "zoe" }))).toEqual(["1"]);
      expect(idsOf(run({ search: "REED" }))).toEqual(["1"]);
    });

    it("ignores surrounding spaces", () => {
      expect(idsOf(run({ search: "  hugo  " }))).toEqual(["3"]);
    });

    it("returns everyone when the search is empty", () => {
      expect(run({ search: "" })).toHaveLength(3);
    });

    it("returns nothing when nobody matches", () => {
      expect(run({ search: "nobody" })).toEqual([]);
    });
  });

  describe("shift filter", () => {
    it('keeps everyone when the value is "all"', () => {
      expect(run({ shiftId: "all" })).toHaveLength(3);
    });

    it("keeps only the chosen shift", () => {
      expect(idsOf(run({ shiftId: "shiftA" })).sort()).toEqual(["1", "3"]);
      expect(idsOf(run({ shiftId: "shiftB" }))).toEqual(["2"]);
    });
  });

  describe("status filter", () => {
    it('"onShift" keeps only people in the active shift', () => {
      expect(idsOf(run({ status: "onShift" })).sort()).toEqual(["1", "3"]);
    });

    it('"idle" keeps everyone else', () => {
      expect(idsOf(run({ status: "idle" }))).toEqual(["2"]);
    });

    it("treats everybody as idle when no shift is running", () => {
      expect(run({ status: "onShift" }, null)).toEqual([]);
      expect(run({ status: "idle" }, null)).toHaveLength(3);
    });
  });

  describe("sorting", () => {
    it("sorts by employment date, newest first", () => {
      expect(idsOf(run({ sortBy: "employmentDate", sortDirection: "desc" })))
        .toEqual(["3", "1", "2"]);
    });

    it("sorts by employment date, oldest first", () => {
      expect(idsOf(run({ sortBy: "employmentDate", sortDirection: "asc" })))
        .toEqual(["2", "1", "3"]);
    });

    it("sorts by billing date", () => {
      expect(idsOf(run({ sortBy: "billingDate", sortDirection: "asc" })))
        .toEqual(["1", "3", "2"]);
    });
  });

  it("applies filters and sorting together", () => {
    const result = run({ shiftId: "shiftA", sortDirection: "asc" });
    expect(idsOf(result)).toEqual(["1", "3"]);
  });

  it("does not modify the array it was given", () => {
    const original = idsOf(employees);
    run({ sortDirection: "asc" });
    expect(idsOf(employees)).toEqual(original);
  });

  it("returns an empty array when there are no employees", () => {
    expect(getVisibleEmployees([], DEFAULT_FILTERS, shiftA)).toEqual([]);
  });
});
