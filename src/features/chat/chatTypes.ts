export interface ChatMessage {
  id: string;
  text: string;
  author: string;
  sentAt: string;
}

export type ChatStatus = "connecting" | "open" | "closed";