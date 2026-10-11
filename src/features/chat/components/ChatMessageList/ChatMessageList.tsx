import { useScrollToBottom } from "../../hooks/useScrollToBottom";
import { formatChatTime } from "../../utils/formatChatTime";
import type { ChatMessage } from "../../chatTypes";

const MESSAGE = "max-w-4/5 rounded border px-3 py-2";
const MESSAGE_OWN = `${MESSAGE} self-end border-ink bg-ink text-white`;
const MESSAGE_OTHER = `${MESSAGE} border-border`;

interface ChatMessageListProps {
  author: string;
  messages: ChatMessage[];
}

const ChatMessageList = ({ author, messages }: ChatMessageListProps) => {
  const listRef = useScrollToBottom<HTMLUListElement>(messages);

  if (messages.length === 0) {
    return (
      <p className="grid flex-1 place-items-center text-md opacity-60">No messages yet</p>
    );
  }

  return (
    <ul ref={listRef} className="flex flex-1 flex-col gap-2 overflow-y-auto p-4" aria-live="polite">
      {messages.map((message) => (
        <li
          key={message.id}
          className={message.author === author ? MESSAGE_OWN : MESSAGE_OTHER}
        >
          <p className="mb-1 text-2xs opacity-70">
            {message.author} ·{" "}
            <time dateTime={message.sentAt}>{formatChatTime(message.sentAt)}</time>
          </p>
          <p className="text-md wrap-anywhere">{message.text}</p>
        </li>
      ))}
    </ul>
  );
};

export default ChatMessageList;
