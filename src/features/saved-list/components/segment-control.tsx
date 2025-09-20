import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface SegmentOption {
  label: string;
  value: string;
}

interface SegmentControlProps {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  className?: string;
  options: SegmentOption[];
}

export default function SegmentControl({
  selectedValue,
  setSelectedValue,
  className,
  options,
}: SegmentControlProps) {
  return (
    <RadioGroup
      className={twMerge(
        "bg-light-10 w-full flex gap-[8px] h-[48px] p-[4px] rounded-[12px]",
        className
      )}
      value={selectedValue}
      onValueChange={(value) => setSelectedValue(value)}
    >
      {options.map((option, idx) => (
        <div
          key={option.value}
          className={clsx(
            "flex items-center flex-1 rounded-[8px]",
            selectedValue === option.value && "bg-light-20"
          )}
        >
          <RadioGroupItem value={option.value} id={`r${idx}`} />
          <Label
            className={clsx(
              "w-full cursor-pointer text-center",
              selectedValue === option.value
                ? "text-light-100"
                : "text-light-40"
            )}
            htmlFor={`r${idx}`}
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
