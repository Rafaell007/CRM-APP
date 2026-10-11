import { useEffect, useRef, useState } from "react";
import { parseChatMessage } from "../utils/parseChatMessage";
import { toEchoReply } from "../utils/toEchoReply";
import { CHAT_URL } from "../chatConstants";
import type { ChatMessage, ChatStatus } from "../chatTypes";

export const useChat = (author: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("connecting");
  const socketRef = useRef<WebSocket | null>(null);
  // Ids of our own messages still waiting for their echo
  const pendingIdsRef = useRef(new Set<string>());

  useEffect(() => {
    const socket = new WebSocket(CHAT_URL);
    socketRef.current = socket;

    socket.onopen = () => setStatus("open");
    socket.onclose = () => setStatus("closed");
    socket.onmessage = (event) => {
      const message = parseChatMessage(String(event.data));
      if (!message) return;

      const isEcho = pendingIdsRef.current.delete(message.id);
      setMessages((current) => [...current, isEcho ? toEchoReply(message) : message]);
    };

    return () => {
      socket.onclose = null; // an old socket must not change the status
      socket.close();
    };
  }, []);

  const sendMessage = (text: string) => {
    const socket = socketRef.current;
    if (socket?.readyState !== WebSocket.OPEN) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      author,
      sentAt: new Date().toISOString(),
    };
    pendingIdsRef.current.add(message.id);
    socket.send(JSON.stringify(message));
    setMessages((current) => [...current, message]);
  };

  return { messages, status, sendMessage };
};
