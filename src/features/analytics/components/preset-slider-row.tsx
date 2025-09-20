import { FormControl, FormField, FormItem, FormLabel } from "@/shared/ui/form";
import { Slider } from "@/shared/ui/slider";
import { useEffect } from "react";

type PresetSliderRowProps = {
  name: string;
  displayName?: string;
  form: any;
  open: boolean;
  min?: number;
  max?: number;
  step?: number;
  mirrorTo?: string;
  summarySuffix?: string;
};

export default function PresetSliderRow({
  name,
  displayName,
  form,
  open,
  min = 0,
  max = 100,
  step = 1,
  mirrorTo,
}: PresetSliderRowProps) {
  const mirrorValue = mirrorTo ? form.watch?.(mirrorTo) : undefined;

  useEffect(() => {
    if (!mirrorTo) return;
    const v = Number(mirrorValue ?? min);
    const curr = Number(form.getValues(name) ?? min);
    if (v !== curr) {
      form.setValue(name, v, { shouldValidate: true });
    }
  }, [mirrorValue, mirrorTo, form, name, min]);

  if (!open) {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {displayName ? (
            <FormLabel className="text-light-100">{displayName}</FormLabel>
          ) : null}
          <FormControl>
            <Slider
              min={min}
              max={max}
              step={step}
              value={[Number(field.value ?? min)]}
              onValueChange={(vals) => {
                const v = Number(vals?.[0] ?? min);
                field.onChange(v);
                if (mirrorTo) {
                  form.setValue(mirrorTo, v, { shouldValidate: true });
                }
              }}
              className="w-full"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
