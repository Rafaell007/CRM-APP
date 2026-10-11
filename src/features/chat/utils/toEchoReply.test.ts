import { describe, it, expect } from "vitest";
import { toEchoReply } from "./toEchoReply";
import { ECHO_AUTHOR } from "../chatConstants";
import type { ChatMessage } from "../chatTypes";

const message: ChatMessage = {
  id: "1",
  text: "Table 4 needs water",
  author: "anna@restcrm.com",
  sentAt: "2026-10-11T10:00:00.000Z",
};

describe("toEchoReply", () => {
  it("keeps the text but comes from the echo server", () => {
    const reply = toEchoReply(message);

    expect(reply.text).toBe(message.text);
    expect(reply.author).toBe(ECHO_AUTHOR);
  });

  it("gets its own id, so it never clashes with the original", () => {
    expect(toEchoReply(message).id).toBe("1-echo");
  });

  it("is dated when the echo arrived", () => {
    const receivedAt = new Date("2026-10-11T10:00:02.000Z");

    expect(toEchoReply(message, receivedAt).sentAt).toBe("2026-10-11T10:00:02.000Z");
  });
});
