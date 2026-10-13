import { ECHO_AUTHOR } from "../chatConstants";
import type { ChatMessage } from "../chatTypes";

export const toEchoReply = (
  message: ChatMessage,
  receivedAt = new Date(),
): ChatMessage => ({
  ...message,
  id: `${message.id}-echo`,
  author: ECHO_AUTHOR,
  sentAt: receivedAt.toISOString(),
});
