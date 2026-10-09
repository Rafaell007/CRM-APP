import type { ChatMessage } from "./chatTypes";

const isChatMessage = (value: unknown): value is ChatMessage =>
  typeof value === "object" &&
  value !== null &&
  "id" in value && typeof value.id === "string" &&
  "text" in value && typeof value.text === "string" &&
  "author" in value && typeof value.author === "string" &&
  "sentAt" in value && typeof value.sentAt === "string";

export const parseChatMessage = (text: string): ChatMessage | null => {
  try {
    const data: unknown = JSON.parse(text);
    return isChatMessage(data) ? data : null;
  } catch {
    return null;
  }
};
