import { useEffect, useState } from "react";
import { usePlatform } from "./use-platform";

export default function UseKeyboardOpen() {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const { isDesktop } = usePlatform();

  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;

      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        setKeyboardOpen(!isDesktop);
      }
    };
    const onBlur = () => setKeyboardOpen(false);

    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);

    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
    };
  }, []);

  return keyboardOpen;
}
