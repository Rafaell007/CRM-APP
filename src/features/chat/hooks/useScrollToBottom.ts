import { useEffect, useRef } from "react";

// Keeps a scrollable element at its end every time `trigger` changes (e.g. a new message)
export const useScrollToBottom = <T extends HTMLElement>(trigger: unknown) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [trigger]);

  return ref;
};
