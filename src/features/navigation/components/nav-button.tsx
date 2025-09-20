import { Button } from "@/shared/ui/button";
import clsx from "clsx";
import React from "react";

interface Props {
  icon: React.ReactElement;
  label: string;
  active: boolean;
  onClick?: () => void;
}

export default function NavButton({ icon, label, active, onClick }: Props) {
  const styledIcon = React.cloneElement(icon, {
    className: clsx(
      "size-6 z-10 transition-all duration-200",
      active ? "fill-primary-100" : "fill-secondary-background/40"
    ),
  });

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="relative flex h-[82px] w-1/4 flex-col items-center p-0 hover:bg-none hover:bg-transparent"
    >
      <div
        className={clsx(
          "flex h-full w-1/2 flex-col items-center justify-center gap-1",
          active ? "border-t border-primary-100" : "border-0"
        )}
      >
        {styledIcon}
        <p
          className={clsx(
            "text-xs font-light",
            active ? "text-primary-100" : "text-secondary-background/40"
          )}
        >
          {label}
        </p>
      </div>
    </Button>
  );
}
