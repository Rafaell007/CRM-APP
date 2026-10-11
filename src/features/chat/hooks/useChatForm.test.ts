import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useChatForm } from "./useChatForm";
import type { ChatStatus } from "../chatTypes";

const submitEvent = () => ({ preventDefault: vi.fn() });

const renderForm = (status: ChatStatus = "open") => {
  const onSend = vi.fn();
  const hook = renderHook(() => useChatForm(status, onSend));
  return { ...hook, onSend };
};

describe("useChatForm", () => {
  it("cannot send an empty or blank message", () => {
    const { result } = renderForm();
    expect(result.current.canSend).toBe(false);

    act(() => result.current.setDraft("   "));

    expect(result.current.canSend).toBe(false);
  });

  it("cannot send while the chat is not connected", () => {
    const { result } = renderForm("connecting");

    act(() => result.current.setDraft("Hello"));

    expect(result.current.canSend).toBe(false);
  });

  it("sends the trimmed text and clears the input", () => {
    const { result, onSend } = renderForm();
    act(() => result.current.setDraft("  Hello  "));

    act(() => result.current.handleSubmit(submitEvent()));

    expect(onSend).toHaveBeenCalledWith("Hello");
    expect(result.current.draft).toBe("");
  });

  it("does not send when it cannot, and keeps the text", () => {
    const { result, onSend } = renderForm("closed");
    act(() => result.current.setDraft("Hello"));

    act(() => result.current.handleSubmit(submitEvent()));

    expect(onSend).not.toHaveBeenCalled();
    expect(result.current.draft).toBe("Hello");
  });

  it("stops the browser from reloading the page on submit", () => {
    const { result } = renderForm();
    const event = submitEvent();

    act(() => result.current.handleSubmit(event));

    expect(event.preventDefault).toHaveBeenCalled();
  });
});
