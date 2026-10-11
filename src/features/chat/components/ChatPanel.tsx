import ChatMessageList from "./ChatMessageList";
import ChatForm from "./ChatForm";
import { STATUS_LABELS } from "../chatConstants";
import type { ChatMessage, ChatStatus } from "../chatTypes";

const STATUS_DOT_COLORS: Record<ChatStatus, string> = {
  connecting: "bg-muted",
  open: "bg-success",
  closed: "bg-danger",
};

interface ChatPanelProps {
  author: string;
  messages: ChatMessage[];
  status: ChatStatus;
  onSend: (text: string) => void;
}

const ChatPanel = ({ author, messages, status, onSend }: ChatPanelProps) => (
  <section
    className="flex h-[min(480px,calc(100vh-120px))] w-[min(360px,calc(100vw-32px))] flex-col rounded border border-border bg-surface shadow-popover"
    aria-label="Team chat"
  >
    <header className="flex items-center justify-between border-b border-border p-4">
      <h2 className="text-lg font-bold">Team chat</h2>
      <span className="flex items-center gap-1.5 text-sm">
        <span className={`size-2 rounded-full ${STATUS_DOT_COLORS[status]}`} />
        {STATUS_LABELS[status]}
      </span>
    </header>

    <ChatMessageList author={author} messages={messages} />
    <ChatForm status={status} onSend={onSend} />
  </section>
);

export default ChatPanel;
