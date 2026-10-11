import { useState, type SubmitEvent } from "react";
import type { ChatStatus } from "../chatTypes";

type SubmitLike = Pick<SubmitEvent<HTMLFormElement>, "preventDefault">;

export const useChatForm = (status: ChatStatus, onSend: (text: string) => void) => {
  const [draft, setDraft] = useState("");
  const text = draft.trim();
  const canSend = status === "open" && text !== "";

  const handleSubmit = (event: SubmitLike) => {
    event.preventDefault();
    if (!canSend) return;
    onSend(text);
    setDraft("");
  };

  return { draft, setDraft, canSend, handleSubmit };
};
