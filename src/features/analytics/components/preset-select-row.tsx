import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { RadioGroup } from "@/shared/ui/radio-group";

type PrimitiveOption = string;
type ObjectOption = { label: string; value: string; disabled?: boolean };
type Option = PrimitiveOption | ObjectOption;

function toObjectOption(opt: Option): ObjectOption {
  return typeof opt === "string" ? { label: opt, value: opt } : opt;
}

export type PresetSelectRowProps = {
  name: string;
  label?: string;
  options: Option[];
  descriptionId?: string;
  className?: string;
  disabled?: boolean;
  open: boolean;
};

export default function PresetSelectRow({
  name,
  label = "Statistics Period",
  options,
  descriptionId,
  className,
  disabled,
  open,
}: PresetSelectRowProps) {
  const { control } = useFormContext();
  const normalized = React.useMemo(
    () => options.map(toObjectOption),
    [options]
  );

  const currentValue = useWatch({ control, name });

  const currentLabel =
    normalized.find((o) => o.value === currentValue)?.label ??
    String(currentValue ?? "");

  if (!open) {
    return (
      <div className="flex flex-col gap-[4px]">
        <FormLabel className="text-light-100">{label}</FormLabel>
        <p className="text-light-40 text-[12px] font-[400]">
          {currentLabel || "—"}
        </p>
      </div>
    );
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={["gap-[12px]", className].filter(Boolean).join(" ")}
        >
          <FormLabel className="text-light-100">{label}</FormLabel>
          <FormControl>
            <RadioGroup
              value={field.value ?? ""}
              onValueChange={(val: string) => field.onChange(val)}
              className="inline-flex items-center gap-2 bg-light-20 rounded-[8px] p-[4px]"
              aria-describedby={descriptionId}
              aria-disabled={disabled ? "true" : undefined}
            >
              {normalized.map(
                ({ label: text, value, disabled: optDisabled }) => {
                  const isChecked = field.value === value;
                  const isDisabled = disabled || optDisabled;
                  return (
                    <label
                      key={value}
                      className={[
                        "flex-1 text-center",
                        isDisabled
                          ? "opacity-60 cursor-not-allowed"
                          : "cursor-pointer",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name={name}
                        value={value}
                        checked={!!isChecked}
                        onChange={() => field.onChange(value)}
                        disabled={isDisabled}
                        className="peer sr-only"
                      />
                      <span
                        className={[
                          "inline-block w-full px-4 py-2 rounded-[8px] text-light-40",
                          "peer-checked:bg-background-8 peer-checked:text-light-60",
                          "border-light-30",
                        ].join(" ")}
                        role="radio"
                        aria-checked={isChecked ? "true" : "false"}
                      >
                        {text}
                      </span>
                    </label>
                  );
                }
              )}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
