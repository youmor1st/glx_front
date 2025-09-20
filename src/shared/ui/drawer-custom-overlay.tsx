import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface DrawerCustomOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClick: () => void;
}

const DrawerCustomOverlay = React.forwardRef<
  HTMLDivElement,
  DrawerCustomOverlayProps
>(({ open, onClick, className, children, ...props }, ref) => {
  if (!open) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "inset-0 fixed bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-200",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

DrawerCustomOverlay.displayName = "DrawerCustomOverlay";

export default DrawerCustomOverlay;
