import { useScrollToBottom } from "../../hooks/useScrollToBottom";
import { formatChatTime } from "../../utils/formatChatTime";
import type { ChatMessage } from "../../chatTypes";
import "./ChatMessageList.css";

interface ChatMessageListProps {
  author: string;
  messages: ChatMessage[];
}

const ChatMessageList = ({ author, messages }: ChatMessageListProps) => {
  const listRef = useScrollToBottom<HTMLUListElement>(messages);

  if (messages.length === 0) {
    return <p className="chat-messages__empty">No messages yet</p>;
  }

  return (
    <ul ref={listRef} className="chat-messages" aria-live="polite">
      {messages.map((message) => (
        <li
          key={message.id}
          className={`chat-messages__item ${message.author === author ? "chat-messages__item--own" : ""}`}
        >
          <p className="chat-messages__meta">
            {message.author} ·{" "}
            <time dateTime={message.sentAt}>{formatChatTime(message.sentAt)}</time>
          </p>
          <p className="chat-messages__text">{message.text}</p>
        </li>
      ))}
    </ul>
  );
};

export default ChatMessageList;
