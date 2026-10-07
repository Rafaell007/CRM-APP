import { describe, it, expect } from "vitest";
import { isSortDirection, isStatus } from "./filterGuards";

describe("isSortDirection", () => {
  it("accepts both sort directions", () => {
    expect(isSortDirection("asc")).toBe(true);
    expect(isSortDirection("desc")).toBe(true);
  });

  it("rejects the empty 'Not sorted' option", () => {
    expect(isSortDirection("")).toBe(false);
  });

  it("rejects anything else, including a different case", () => {
    expect(isSortDirection("newest")).toBe(false);
    expect(isSortDirection("ASC")).toBe(false);
  });
});

describe("isStatus", () => {
  it("accepts every status", () => {
    expect(isStatus("all")).toBe(true);
    expect(isStatus("onShift")).toBe(true);
    expect(isStatus("idle")).toBe(true);
  });

  it("rejects anything else, including a different case", () => {
    expect(isStatus("")).toBe(false);
    expect(isStatus("busy")).toBe(false);
    expect(isStatus("onshift")).toBe(false);
  });
});
