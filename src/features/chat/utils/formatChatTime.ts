// "2026-10-11T18:05:00.000Z" -> "08:05 PM" (in the user's locale and time zone)
export const formatChatTime = (isoDate: string): string =>
  new Date(isoDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
