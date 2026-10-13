export const formatChatTime = (isoDate: string): string =>
  new Date(isoDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
