import { TickIcon } from "./icons";
import { Label } from "./label";
import { RadioGroupItem } from "./radio-group";

interface RadioOptionProps {
  value: string;
  id: string;
  title: string;
}

export default function RadioOption({ value, id, title }: RadioOptionProps) {
  return (
    <div className="w-full">
      <RadioGroupItem value={value} id={id} className="peer sr-only" />

      <Label
        htmlFor={id}
        className="
    flex items-center justify-between px-[12px] py-[16px] text-[16px] font-[600]
    text-light-100 cursor-pointer w-full rounded-[12px]
    peer-data-[state=checked]:bg-background-8
    [&_.tick]:hidden
    peer-data-[state=checked]:[&_.tick]:block
  "
      >
        {title}
        <TickIcon className="tick size-[24px] fill-violet-accent" />
      </Label>
    </div>
  );
}
