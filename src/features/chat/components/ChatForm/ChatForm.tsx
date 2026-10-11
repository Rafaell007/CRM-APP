import { Send } from "lucide-react";
import { useChatForm } from "../../hooks/useChatForm";
import type { ChatStatus } from "../../chatTypes";
import "./ChatForm.css";

interface ChatFormProps {
  status: ChatStatus;
  onSend: (text: string) => void;
}

const ChatForm = ({ status, onSend }: ChatFormProps) => {
  const { draft, setDraft, canSend, handleSubmit } = useChatForm(status, onSend);

  return (
    <form className="chat-form" onSubmit={handleSubmit}>
      <input
        className="chat-form__input"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Write a message"
        aria-label="Message"
        maxLength={500}
        autoFocus
      />
      <button
        type="submit"
        className="chat-form__send"
        disabled={!canSend}
        aria-label="Send message"
      >
        <Send size={18} aria-hidden="true" />
      </button>
    </form>
  );
};

export default ChatForm;
