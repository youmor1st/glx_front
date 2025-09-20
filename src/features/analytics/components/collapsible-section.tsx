import { Button } from "@/shared/ui/button";
import { ArrowIcon } from "@/shared/ui/icons";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function CollapsibleSection({
  title,
  children,
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={twMerge(
        "w-full bg-light-10 rounded-[12px] transition-colors duration-300",
        isOpen && "bg-[#48269C]",
        className
      )}
    >
      <Button
        className="flex justify-between items-center cursor-pointer w-full px-[20px] py-[16px]"
        onClick={toggleOpen}
      >
        <h3 className="text-light-100 font-[700] text-[20px]">{title}</h3>
        <ArrowIcon
          className={twMerge(
            "fill-light-100 size-[28px] transition-transform duration-300",
            isOpen ? "rotate-90" : "rotate-270"
          )}
        />
      </Button>
      {isOpen && (
        <div className="flex flex-col px-[20px] pb-[16px] gap-[182px]">
          {children}
        </div>
      )}
    </div>
  );
}
