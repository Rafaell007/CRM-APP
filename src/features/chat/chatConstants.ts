import type { ChatStatus } from "./chatTypes";

export const CHAT_URL = "wss://ws.ifelse.io";

export const ECHO_AUTHOR = "Echo server";

export const STATUS_LABELS: Record<ChatStatus, string> = {
  connecting: "Connecting…",
  open: "Online",
  closed: "Offline",
};
