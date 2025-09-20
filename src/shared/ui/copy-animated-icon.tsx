import { AnimatePresence, motion } from "framer-motion";

import { twMerge } from "tailwind-merge";
import { CopyIcon, TickIcon } from "./icons";

interface CopyAnimatedIconProps {
  copied: boolean;
  className?: string;
}

export const CopyAnimatedIcon = ({
  copied,
  className,
}: CopyAnimatedIconProps) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {!copied ? (
        <motion.span
          key="copy"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <CopyIcon className={twMerge("fill-light-100 size-5", className)} />
        </motion.span>
      ) : (
        <motion.span
          key="tick"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <TickIcon className={twMerge("fill-light-100 size-5", className)} />
        </motion.span>
      )}
    </AnimatePresence>
  );
};
