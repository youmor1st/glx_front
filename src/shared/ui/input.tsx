import * as React from "react";

import { cn } from "@/shared/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
}

function Input({
  className,
  type,
  label,
  id,
  placeholder,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  return (
    <div className="flex flex-col gap-[12px]">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[12px] font-semibold text-light-100 w-full"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        data-slot="input"
        placeholder={placeholder}
        className={cn(
          "file:text-light-100 placeholder:text-light-40 selection:bg-light-60 selection:text-primary-foreground dark:bg-input/30 border-light-40 flex h-[48px] w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-indicator-red",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
