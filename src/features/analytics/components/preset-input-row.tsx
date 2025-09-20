import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { twMerge } from "tailwind-merge";
import { Input } from "@/shared/ui/input";

type Props = {
  displayName?: string;
  name: string;
  placeholder?: string;
  form: any;
  open: boolean;
  prefix?: string;
  type?: "text" | "number";
  step?: number | "any";
};

export default function PresetInputRow({
  displayName,
  name,
  placeholder,
  form,
  open,
  prefix,
  type = "text",
  step = "any",
}: Props) {
  if (!open) {
    const currentValue = form.getValues(name);
    return (
      <div className="flex flex-col gap-[4px]">
        <FormLabel className="text-light-100">{displayName}</FormLabel>
        <p className="text-light-40 text-[12px] font-[400]">
          {prefix}
          {currentValue ?? placeholder ?? ""}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px] w-full">
      {displayName && (
        <FormLabel className="text-light-100">{displayName}</FormLabel>
      )}
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative w-full">
                {prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-40 text-sm">
                    {prefix}
                  </span>
                )}
                <Input
                  {...field}
                  type={type}
                  step={
                    type === "number" ? (step as number | string) : undefined
                  }
                  className={twMerge(
                    "w-full h-[48px] rounded-[8px] border border-light-30 bg-transparent text-[12px] px-[12px]",
                    prefix && "pl-7",
                    open ? "text-light-100" : "text-light-40 border-0 px-0"
                  )}
                  placeholder={placeholder}
                />
              </div>
            </FormControl>
            <FormMessage className="text-[12px]" />
          </FormItem>
        )}
      />
    </div>
  );
}
