import { useEffect, useRef } from "react";

export const useScrollToBottom = <T extends HTMLElement>(trigger: unknown) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [trigger]);

  return ref;
};
