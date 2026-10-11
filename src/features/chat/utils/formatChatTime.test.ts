import { describe, it, expect } from "vitest";
import { formatChatTime } from "./formatChatTime";

describe("formatChatTime", () => {
  it("shows hours and minutes, without seconds", () => {
    // 10:05:42 local time, so the result does not depend on the time zone
    const isoDate = new Date(2026, 9, 11, 10, 5, 42).toISOString();

    const time = formatChatTime(isoDate);

    expect(time).toContain("10");
    expect(time).toContain("05");
    expect(time).not.toContain("42");
  });
});
