import { describe, it, expect } from "vitest";
import { getErrorMessage } from "./getErrorMessage";

describe("getErrorMessage", () => {
  it("returns the message of an Error", () => {
    expect(getErrorMessage(new Error("Permission denied"))).toBe("Permission denied");
  });

  it("returns the message of an Error subclass", () => {
    expect(getErrorMessage(new TypeError("Bad input"))).toBe("Bad input");
  });

  it("falls back for anything that is not an Error", () => {
    expect(getErrorMessage("oops")).toBe("Unknown error");
    expect(getErrorMessage(42)).toBe("Unknown error");
    expect(getErrorMessage(null)).toBe("Unknown error");
    expect(getErrorMessage(undefined)).toBe("Unknown error");
    expect(getErrorMessage({ message: "looks like an error" })).toBe("Unknown error");
  });
});
