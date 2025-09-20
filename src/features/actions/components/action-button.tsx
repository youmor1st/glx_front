import React from "react";
import { Button } from "@/shared/ui/button";
import clsx from "clsx";

interface Props {
  icon: React.ReactElement;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const ActionButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ icon, label, active = true, onClick }, ref) => {
    const styledIcon = React.cloneElement(icon, {
      className: clsx(
        "size-6 z-10 transition-all duration-200",
        active ? "fill-primary-100" : "fill-secondary-background/40"
      ),
    });

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        onClick={onClick}
        className={clsx(
          "relative p-[1px] rounded-[16px] bg-gradient-to-b  h-[72px] w-[72px]",
          active
            ? " from-primary-100 to-[#171339]"
            : "from-[#281E54] to-[#171339]"
        )}
      >
        <div className="rounded-[15px] bg-[#0D0D1A] hover:bg-[#141429] p-5 h-full flex justify-center items-center max-h-[70px] max-w-[70px] w-full">
          <div className="flex flex-col gap-1 items-center">
            {styledIcon}
            <p
              className={clsx(
                "text-[10px] font-light",
                active ? "text-primary-100" : "text-secondary-background/40"
              )}
            >
              {label}
            </p>
          </div>
        </div>
      </Button>
    );
  }
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
