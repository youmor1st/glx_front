import { FormControl, FormItem, FormLabel } from "@/shared/ui/form";
import { Checkbox } from "./checkbox";

interface RadioSelectTileProps {
  value: string;
  label: string;
  blockchain?: BlockchainType;
  icon?: React.ReactElement;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const CheckboxSelectCard = ({
  value,
  label,
  icon,
  checked,
  onCheckedChange,
}: RadioSelectTileProps) => {
  return (
    <FormItem className="flex relative bg-light-20 hover:bg-light-25 justify-between items-center border-0 space-x-3 space-y-0 h-[48px] px-[12px] rounded-[8px] transition-all">
      {icon || <div />}
      <FormLabel className="font-normal absolute text-light-100 cursor-pointer left-0 w-full h-full m-0">
        <span className={icon ? "ml-[48px]" : "ml-[16px]"}>{label}</span>
      </FormLabel>
      <FormControl>
        <Checkbox
          className="m-0"
          value={value}
          checked={checked}
          onCheckedChange={onCheckedChange}
        ></Checkbox>
      </FormControl>
    </FormItem>
  );
};
