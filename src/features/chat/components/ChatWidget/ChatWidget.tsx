import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import ChatPanel from "../ChatPanel/ChatPanel";
import "./ChatWidget.css";

interface ChatWidgetProps {
  author: string;
}

// Stays mounted while the user is logged in, so the connection and the
// messages survive page changes and closing the panel
const ChatWidget = ({ author }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, status, sendMessage } = useChat(author);

  return (
    <div className="chat-widget">
      {isOpen && (
        <ChatPanel
          author={author}
          messages={messages}
          status={status}
          onSend={sendMessage}
        />
      )}

      <button
        type="button"
        className="chat-widget__toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={22} aria-hidden="true" />
        ) : (
          <MessageCircle size={22} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
