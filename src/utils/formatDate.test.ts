import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats an ISO string as a short readable date", () => {
    expect(formatDate("2021-03-25T12:00:00.000Z")).toBe("Mar 25, 2021");
  });

  it("returns a dash for a missing value", () => {
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate(null)).toBe("—");
    expect(formatDate("")).toBe("—");
  });
});
