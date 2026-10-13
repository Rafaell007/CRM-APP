import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useChat } from "../hooks/useChat";
import ChatPanel from "./ChatPanel";

interface ChatWidgetProps {
  author: string;
}

const ChatWidget = ({ author }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, status, sendMessage } = useChat(author);

  // z-30: above the admin mobile menu (z-10 overlay, z-20 drawer)
  return (
    <div className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-2">
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
        className="grid size-13 place-items-center rounded-full bg-ink text-white shadow-fab"
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
