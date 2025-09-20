import React from "react";
import { Button } from "@/shared/ui/button";
import { ArrowRightIcon } from "@/shared/ui/icons";
import { twMerge } from "tailwind-merge";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";

interface FilterButtonProps {
  active: boolean;
  title: string;
  className?: string;
  icon?: React.ReactNode;
  hideArrow?: boolean;
  onClick?: () => void;
  glow?: boolean;
}

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  (
    {
      active,
      title,
      className,
      icon,
      hideArrow = false,
      onClick,
      glow = false,
      ...props
    },
    ref
  ) => {
    const angle = useMotionValue(0);
    useAnimationFrame((t) => glow && angle.set((t / 30) % 360));
    const background = useTransform(
      angle,
      (a) => `linear-gradient(${a}deg, #150479, #8615FB, #B72FD9)`
    );

    const wrapperProps = glow ? { style: { background } } : {};

    return (
      <motion.div
        {...wrapperProps}
        className={twMerge(
          "p-[1px] rounded-[101px] h-[26px] flex",
          glow ? "" : "bg-secondary-background/8"
        )}
      >
        <Button
          ref={ref}
          variant="small"
          size="small"
          onClick={onClick}
          {...props}
          className={twMerge(
            "rounded-[100px] gap-[2px] hover:bg-light-20 h-[24px] z-20",
            active && !glow && "bg-button-active",
            active &&
              glow &&
              "bg-[linear-gradient(90deg,#0B0246,#4B0C99,#6E1580)]",
            className
          )}
        >
          {icon}
          {title}
          {!hideArrow && (
            <ArrowRightIcon className="size-4 fill-light-100 flex-shrink-0 rotate-90" />
          )}
        </Button>
      </motion.div>
    );
  }
);

FilterButton.displayName = "FilterButton";

export default FilterButton;
