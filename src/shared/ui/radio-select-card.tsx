import { FormControl, FormItem, FormLabel } from "@/shared/ui/form";
import { RadioGroupItem } from "@/shared/ui/radio-group";
import { twMerge } from "tailwind-merge";

interface RadioSelectTileProps {
  value: string;
  label: string;
  blockchain?: BlockchainType;
  icon?: React.ReactElement;
  className?: string;
}

export const RadioSelectCard = ({
  value,
  label,
  icon,
  className,
}: RadioSelectTileProps) => {
  return (
    <FormItem
      className={twMerge(
        "flex relative bg-light-20 hover:bg-light-30 justify-between items-center border-0 space-x-3 space-y-0 h-[48px] px-[12px] rounded-[8px] transition-all",
        className
      )}
    >
      {icon || <div />}
      <FormLabel className="font-normal absolute text-light-100 cursor-pointer left-0 w-full h-full m-0">
        <span className={icon ? "ml-[48px]" : "ml-[16px]"}>{label}</span>
      </FormLabel>
      <FormControl>
        <RadioGroupItem className="m-0" value={value} />
      </FormControl>
    </FormItem>
  );
};
