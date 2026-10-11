import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollToBottom } from "./useScrollToBottom";

// jsdom has no layout, so give the element a fake content height
const scrollableElement = (contentHeight: number) => {
  const element = document.createElement("ul");
  Object.defineProperty(element, "scrollHeight", { value: contentHeight });
  return element;
};

describe("useScrollToBottom", () => {
  it("scrolls the element to its end when the trigger changes", () => {
    const { result, rerender } = renderHook(
      ({ trigger }) => useScrollToBottom<HTMLUListElement>(trigger),
      { initialProps: { trigger: 1 } },
    );
    const element = scrollableElement(500);
    result.current.current = element;

    rerender({ trigger: 2 });

    expect(element.scrollTop).toBe(500);
  });

  it("does nothing while no element is attached", () => {
    const { rerender } = renderHook(
      ({ trigger }) => useScrollToBottom<HTMLUListElement>(trigger),
      { initialProps: { trigger: 1 } },
    );

    expect(() => rerender({ trigger: 2 })).not.toThrow();
  });
});
