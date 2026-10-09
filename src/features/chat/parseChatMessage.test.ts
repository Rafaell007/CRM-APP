import { describe, it, expect } from "vitest";
import { parseChatMessage } from "./parseChatMessage";
import type { ChatMessage } from "./chatTypes";

const message: ChatMessage = {
  id: "1",
  text: "Table 4 needs water",
  author: "anna@restcrm.com",
  sentAt: "2026-10-09T10:00:00.000Z",
};

describe("parseChatMessage", () => {
  it("returns the message for valid JSON", () => {
    expect(parseChatMessage(JSON.stringify(message))).toEqual(message);
  });

  it("returns null for text that is not JSON, like the server greeting", () => {
    expect(parseChatMessage("Request served by 1234")).toBeNull();
  });

  it("returns null when a field is missing", () => {
    const { author: _author, ...withoutAuthor } = message;
    expect(parseChatMessage(JSON.stringify(withoutAuthor))).toBeNull();
  });

  it("returns null when a field has the wrong type", () => {
    expect(parseChatMessage(JSON.stringify({ ...message, id: 1 }))).toBeNull();
  });

  it("returns null for JSON that is not an object", () => {
    expect(parseChatMessage("null")).toBeNull();
    expect(parseChatMessage('"hello"')).toBeNull();
    expect(parseChatMessage("42")).toBeNull();
  });
});
