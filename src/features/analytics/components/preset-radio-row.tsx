import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { RadioGroup } from "@/shared/ui/radio-group";
import { RadioSelectCard } from "@/shared/ui/radio-select-card";
import RangeSelectCardRadio from "@/shared/ui/range-select-card-radio";

type Option = { label: string; value: string };

type PresetRadioRowProps = {
  name: string;
  displayName: string;
  form: any;
  open: boolean;
  options: Option[];
  includeCustom?: boolean;
  customValue?: string;
};

export default function PresetRadioRow({
  name,
  displayName,
  form,
  open,
  options,
  includeCustom = false,
  customValue = "custom",
}: PresetRadioRowProps) {
  const currentValue = form.watch?.(name);
  const selectedLabel =
    options.find((o) => o.value === currentValue)?.label ||
    (currentValue === customValue && "Custom") ||
    "";

  if (!open) {
    return (
      <div className="flex flex-col gap-[4px]">
        <FormLabel className="text-light-100">{displayName}</FormLabel>
        <p className="text-light-40 text-[12px] font-[400]">{selectedLabel}</p>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-[12px]">
          <FormLabel className="text-light-100 justify-between">
            {displayName}
          </FormLabel>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-col gap-[8px]"
            >
              {includeCustom && (
                <RangeSelectCardRadio
                  form={form}
                  value={customValue}
                  selected={form.watch(name) === customValue}
                />
              )}
              {options.map((o) => (
                <RadioSelectCard
                  key={o.value}
                  label={o.label}
                  value={o.value}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
