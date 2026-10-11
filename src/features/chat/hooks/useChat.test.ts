import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useChat } from "./useChat";
import { ECHO_AUTHOR } from "../chatConstants";
import type { ChatMessage } from "../chatTypes";

// Stands in for the browser WebSocket, so the tests never touch the network.
// The test plays the server by calling the handlers by hand.
class FakeWebSocket {
  static OPEN = 1;
  static CLOSED = 3;
  static instances: FakeWebSocket[] = [];

  readyState = 0;
  sent: string[] = [];
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;

  constructor() {
    FakeWebSocket.instances.push(this);
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {
    this.readyState = FakeWebSocket.CLOSED;
  }

  // Helpers for the test: what the browser would do
  open() {
    this.readyState = FakeWebSocket.OPEN;
    this.onopen?.();
  }

  receive(data: string) {
    this.onmessage?.({ data });
  }
}

const AUTHOR = "anna@restcrm.com";

const message: ChatMessage = {
  id: "1",
  text: "Table 4 needs water",
  author: "tom@restcrm.com",
  sentAt: "2026-10-11T10:00:00.000Z",
};

const renderChat = () => {
  const hook = renderHook(() => useChat(AUTHOR));
  const socket = FakeWebSocket.instances[0];
  return { ...hook, socket };
};

beforeEach(() => {
  FakeWebSocket.instances = [];
  vi.stubGlobal("WebSocket", FakeWebSocket);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useChat", () => {
  it("starts connecting and becomes open when the connection opens", () => {
    const { result, socket } = renderChat();
    expect(result.current.status).toBe("connecting");

    act(() => socket.open());

    expect(result.current.status).toBe("open");
  });

  it("becomes closed when the connection drops", () => {
    const { result, socket } = renderChat();

    act(() => {
      socket.open();
      socket.onclose?.();
    });

    expect(result.current.status).toBe("closed");
  });

  it("adds every valid message that arrives", () => {
    const { result, socket } = renderChat();
    const second = { ...message, id: "2", text: "Done" };

    act(() => {
      socket.receive(JSON.stringify(message));
      socket.receive(JSON.stringify(second));
    });

    expect(result.current.messages).toEqual([message, second]);
  });

  it("ignores data that is not a chat message, like the server greeting", () => {
    const { result, socket } = renderChat();

    act(() => {
      socket.receive("Request served by 1234");
      socket.receive(JSON.stringify({ text: "no id or author" }));
    });

    expect(result.current.messages).toEqual([]);
  });

  it("sends the text with the author as JSON when the connection is open", () => {
    const { result, socket } = renderChat();
    act(() => socket.open());

    act(() => result.current.sendMessage("Hello"));

    expect(socket.sent).toHaveLength(1);
    const sent: unknown = JSON.parse(socket.sent[0]);
    expect(sent).toMatchObject({ text: "Hello", author: AUTHOR });
  });

  it("shows a sent message right away as the user's own", () => {
    const { result, socket } = renderChat();
    act(() => socket.open());

    act(() => result.current.sendMessage("Hello"));

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toMatchObject({ text: "Hello", author: AUTHOR });
  });

  it("shows the echo of a sent message as a reply from the echo server", () => {
    const { result, socket } = renderChat();
    act(() => socket.open());
    act(() => result.current.sendMessage("Hello"));

    act(() => socket.receive(socket.sent[0]));

    const [sent, reply] = result.current.messages;
    expect(reply).toMatchObject({ text: "Hello", author: ECHO_AUTHOR });
    expect(reply.id).not.toBe(sent.id);
  });

  it("sends nothing while the connection is not open yet", () => {
    const { result, socket } = renderChat();

    act(() => result.current.sendMessage("Too early"));

    expect(socket.sent).toEqual([]);
  });

  it("closes the connection when the component unmounts", () => {
    const { unmount, socket } = renderChat();
    act(() => socket.open());

    unmount();

    expect(socket.readyState).toBe(FakeWebSocket.CLOSED);
  });
});
