import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { twMerge } from "tailwind-merge";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface PresetInputWithSelectRowProps {
  name: string;
  selectName: string;
  displayName?: string;
  form: any;
  placeholder: string;
  options: { label: string; value: string }[];
  open: boolean;
  step?: number | "any";
  type?: string;
}

export default function PresetInputWithSelectRow({
  name,
  selectName,
  placeholder,
  form,
  displayName,
  options,
  open,
  step = "any",
  type = "number",
}: PresetInputWithSelectRowProps) {
  if (!open) {
    const currentValue = form.getValues(name);
    const selectedOption = options.find(
      (opt) => opt.value === form.getValues(selectName)
    );
    return (
      <div className="flex flex-col gap-[4px]">
        <FormLabel className="text-light-100">{displayName}</FormLabel>
        <p className="text-light-40 text-[12px] font-[400]">
          {currentValue || "0"} {selectedOption?.label || ""}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px] flex-1">
      {displayName && (
        <FormLabel className="text-light-100 w-full flex justify-between">
          {displayName}
        </FormLabel>
      )}

      <div className="relative">
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={!open}
                  {...field}
                  type={type}
                  step={step as number | string}
                  className={twMerge(
                    "w-full h-[48px] px-[12px] py-[12px] rounded-[8px] border border-light-30 bg-transparent text-[12px] appearance-none pr-[96px]",
                    open ? "text-light-100" : "text-light-40 border-0 px-0 py-0"
                  )}
                  placeholder={placeholder}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={selectName}
          render={({ field }) => (
            <FormItem className="absolute right-[12px] top-1/2 -translate-y-1/2">
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!open}
                >
                  <SelectTrigger className="h-[28px] px-[10px] rounded-[24px] bg-light-20 text-[12px] text-light-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
