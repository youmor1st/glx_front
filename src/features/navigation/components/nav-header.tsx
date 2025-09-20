import React from "react";
import { twMerge } from "tailwind-merge";

interface NavHeaderProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export default function NavHeader({
  title,
  left,
  right,
  className,
}: NavHeaderProps) {
  return (
    <div
      className={twMerge(
        "w-full flex border-b border-light-20 pb-[16px]  items-center bg-background-0 ",
        className
      )}
    >
      <div className="flex-1 flex items-center">{left}</div>
      <div className="flex-3 flex justify-center items-center mb-[8px] text-light-100 text-center">
        {title}
      </div>
      <div className="flex-1 flex justify-end items-center">{right}</div>
    </div>
  );
}
