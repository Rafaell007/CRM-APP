import { useEffect, useRef, useState } from "react";
import { parseChatMessage } from "./parseChatMessage";
import { ChatMessage, ChatStatus } from "./chatTypes";

const CHAT_URL = "wss://ws.ifelse.io";

export const useChat = (author: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("connecting");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(CHAT_URL);
    socketRef.current = socket;

    socket.onopen = () => setStatus("open");
    socket.onclose = () => setStatus("closed");
    socket.onmessage = (event) => {
      const message = parseChatMessage(String(event.data));
      if (message) {
        setMessages((current) => [...current, message]);
      }
    };
    return () => socket.close();
  }, []);
  
  const sendMessage = (text: string) => {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      author,
      sentAt: new Date().toISOString(),
    };
    socketRef.current?.send(JSON.stringify(message));
  };

  return { messages, status, sendMessage };
};
