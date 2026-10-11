import ChatMessageList from "../ChatMessageList/ChatMessageList";
import ChatForm from "../ChatForm/ChatForm";
import { STATUS_LABELS } from "../../chatConstants";
import type { ChatMessage, ChatStatus } from "../../chatTypes";
import "./ChatPanel.css";

interface ChatPanelProps {
  author: string;
  messages: ChatMessage[];
  status: ChatStatus;
  onSend: (text: string) => void;
}

const ChatPanel = ({ author, messages, status, onSend }: ChatPanelProps) => (
  <section className="chat-panel" aria-label="Team chat">
    <header className="chat-panel__header">
      <h2 className="chat-panel__title">Team chat</h2>
      <span className={`chat-panel__status chat-panel__status--${status}`}>
        {STATUS_LABELS[status]}
      </span>
    </header>

    <ChatMessageList author={author} messages={messages} />
    <ChatForm status={status} onSend={onSend} />
  </section>
);

export default ChatPanel;
