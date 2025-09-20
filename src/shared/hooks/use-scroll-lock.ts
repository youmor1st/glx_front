import { useEffect } from "react";

export default function useScrollLock(when: boolean) {
  useEffect(() => {
    if (!when) return;

    document.body.style.overflow = "hidden";
    document.ontouchmove = function (e) {
      e.preventDefault();
    };

    return () => {
      document.body.style.overflow = "";
      document.ontouchmove = function () {
        return true;
      };
    };
  }, [when]);
}
