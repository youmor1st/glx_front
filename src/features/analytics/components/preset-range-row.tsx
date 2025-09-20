import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { FieldValues, Path } from "react-hook-form";

type Numberish = number | string | undefined;

type BaseProps<T extends FieldValues> = {
  minName: Path<T>;
  maxName: Path<T>;
  label: string;
  form: any;
  step?: Numberish;
  min?: Numberish;
  max?: Numberish;
  disabled?: boolean;
  className?: string;
  open: boolean;
};

export default function PresetRangeRow<T extends FieldValues>({
  minName,
  maxName,
  label,
  form,
  step,
  min,
  max,
  disabled,
  className,
  open,
}: BaseProps<T>) {
  const control = form.control;

  const toNumberOrEmpty = (v: any) =>
    v === "" || v === null || v === undefined ? "" : Number(v);

  if (!open) {
    return (
      <div className="flex flex-col gap-[4px]">
        <FormLabel className="text-light-100">{label}</FormLabel>
        <p className="text-light-40 text-[12px] font-[400]">
          {form.getValues(minName)}% - {form.getValues(maxName)}%
        </p>
      </div>
    );
  }

  return (
    <div
      className={["flex flex-col gap-[12px] rounded-[8px]", className]
        .filter(Boolean)
        .join(" ")}
    >
      <FormLabel className="text-light-100">{label}</FormLabel>

      <div className="flex gap-[4px] w-full">
        <FormField
          control={control}
          name={minName}
          render={({ field }) => (
            <FormItem className="relative flex-1 self-start">
              <FormLabel className="absolute top-[8px]  left-[16px] text-light-40 text-[10px] font-medium">
                Min
              </FormLabel>
              <FormControl>
                <input
                  type="number"
                  inputMode="decimal"
                  step={step ?? "any"}
                  min={min as any}
                  max={max as any}
                  placeholder="-"
                  disabled={disabled}
                  value={toNumberOrEmpty(field.value)}
                  onChange={async (e) => {
                    const v =
                      e.target.value === "" ? "" : Number(e.target.value);
                    field.onChange(v);
                    await form.trigger(maxName);
                  }}
                  className="text-[12px] active:bg-transparent h-[48px]  w-full pt-[25px] pb-[10px] px-[16px] rounded-[8px] border border-light-30 text-light-100 placeholder:text-light-40"
                />
              </FormControl>
              <FormMessage className="text-[12px]"></FormMessage>
            </FormItem>
          )}
        />
        <div className="h-[1px] w-[12px] mt-[23px] bg-light-40"></div>
        <FormField
          control={control}
          name={maxName}
          render={({ field }) => (
            <FormItem className="relative flex-1">
              <FormLabel className="absolute top-[8px]  left-[16px] text-light-40 text-[10px] font-medium">
                Max
              </FormLabel>
              <FormControl>
                <input
                  type="number"
                  inputMode="decimal"
                  step={step ?? "any"}
                  min={min as any}
                  placeholder="-"
                  max={max as any}
                  disabled={disabled}
                  value={toNumberOrEmpty(field.value)}
                  onChange={async (e) => {
                    const v =
                      e.target.value === "" ? "" : Number(e.target.value);
                    field.onChange(v);
                    await form.trigger(minName);
                  }}
                  className="text-[12px] active:bg-transparent h-[48px]  w-full pt-[25px] pb-[10px] px-[16px] rounded-[8px] border border-light-30 text-light-100 placeholder:text-light-40"
                />
              </FormControl>
              <FormMessage className="text-[12px]"></FormMessage>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
