import { Send } from "lucide-react";
import { useChatForm } from "../hooks/useChatForm";
import type { ChatStatus } from "../chatTypes";

interface ChatFormProps {
  status: ChatStatus;
  onSend: (text: string) => void;
}

const ChatForm = ({ status, onSend }: ChatFormProps) => {
  const { draft, setDraft, canSend, handleSubmit } = useChatForm(status, onSend);

  return (
    <form className="flex gap-2 border-t border-border p-4" onSubmit={handleSubmit}>
      <input
        className="min-w-0 flex-1 rounded border border-border px-3 py-2.5 focus:border-ink focus:outline-none"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Write a message"
        aria-label="Message"
        maxLength={500}
        autoFocus
      />
      <button
        type="submit"
        className="grid place-items-center rounded bg-ink px-3.5 text-white disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!canSend}
        aria-label="Send message"
      >
        <Send size={18} aria-hidden="true" />
      </button>
    </form>
  );
};

export default ChatForm;
