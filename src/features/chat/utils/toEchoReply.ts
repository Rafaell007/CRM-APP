import { ECHO_AUTHOR } from "../chatConstants";
import type { ChatMessage } from "../chatTypes";

// The echo server sends our own message back; show it as a reply from the server
export const toEchoReply = (
  message: ChatMessage,
  receivedAt = new Date(),
): ChatMessage => ({
  ...message,
  id: `${message.id}-echo`,
  author: ECHO_AUTHOR,
  sentAt: receivedAt.toISOString(),
});
