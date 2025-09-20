import { CheckboxSelectCard } from "@/shared/ui/checkbox-select-card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";

type PlatformOption = {
  label: string;
  value: string;
};

interface PlatformsFieldProps<TFormValues> {
  form: any;
  name: keyof TFormValues & string;
  options: PlatformOption[];
  open: boolean;
}

export function PlatformsField<TFormValues>({
  form,
  name,
  options,
  open,
}: PlatformsFieldProps<TFormValues>) {
  if (!open) {
    return (
      <div className="flex flex-col gap-[4px]">
        <FormLabel className="text-light-100">Tokens</FormLabel>
        <p className="text-light-40 text-[12px] font-[400]">
          {form.watch(name).join(", ").toUpperCase()}
        </p>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={name as any}
      render={() => (
        <FormItem className="gap-[12px]">
          <FormControl>
            <div className="flex flex-col gap-[8px]">
              {options.map(({ label, value }) => (
                <CheckboxSelectCard
                  key={value}
                  label={label}
                  value={value}
                  checked={!!form.watch(name)?.includes(value)}
                  onCheckedChange={(checked: boolean) => {
                    const current = form.getValues(name) || [];
                    form.setValue(
                      name,
                      checked
                        ? [...current, value]
                        : current.filter((v: string) => v !== value),
                      {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      }
                    );
                  }}
                />
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
