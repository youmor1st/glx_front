import { useState } from "react";

export function useCopyWithState(timeout = 1000) {
  const [copied, setCopied] = useState(false);

  const copy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  };

  return { copied, copy };
}
