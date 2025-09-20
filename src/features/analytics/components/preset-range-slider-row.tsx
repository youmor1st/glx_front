import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Slider } from "@/shared/ui/slider";

type PresetRangeSliderRowProps = {
  label: string;
  minName: string;
  maxName: string;
  form: any;
  open: boolean;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
};

export default function PresetRangeSliderRow({
  label,
  minName,
  maxName,
  form,
  open,
  min = 0,
  max = 100,
  step = 1,
  suffix = "",
}: PresetRangeSliderRowProps) {
  const minVal = Number(form.watch(minName) ?? min);
  const maxVal = Number(form.watch(maxName) ?? max);

  if (!open) {
    return (
      <div className="flex flex-col gap-[4px]">
        <FormLabel className="text-light-100">{label}</FormLabel>
        <p className="text-light-40 text-[12px] font-[400]">
          {minVal} {suffix} — {maxVal} {suffix}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      <FormLabel className="text-light-100">{label}</FormLabel>

      <div className="flex items-start gap-[12px] w-full py-[12px]">
        <FormField
          control={form.control}
          name={minName}
          render={({ field }) => (
            <FormItem className="relative flex-1 ">
              <FormControl>
                <input
                  {...field}
                  type="number"
                  step={step}
                  min={min}
                  max={max}
                  className="w-full h-[48px] text-[12px]  px-[12px] py-[12px] rounded-[12px] border border-light-30 bg-transparent text-light-100 placeholder:text-light-30"
                  placeholder={`Min ${suffix}`.trim()}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const newMin = raw === "" ? "" : Number(raw);
                    const currentMax = form.getValues(maxName);

                    if (
                      newMin !== "" &&
                      currentMax !== "" &&
                      newMin > currentMax
                    ) {
                      form.setValue(minName, currentMax, {
                        shouldValidate: true,
                      });
                      form.setValue(maxName, newMin, { shouldValidate: true });
                    } else {
                      form.setValue(minName, newMin, { shouldValidate: true });
                    }
                  }}
                />
              </FormControl>
              <div className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[12px] text-light-60">
                {suffix}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-light-40 w-[12px] h-[1px] mt-[23px]"></div>

        <FormField
          control={form.control}
          name={maxName}
          render={({ field }) => (
            <FormItem className="relative flex-1">
              <FormControl>
                <input
                  {...field}
                  type="number"
                  step={step}
                  min={min}
                  max={max}
                  className="w-full h-[48px] text-[12px] px-[12px] py-[12px] rounded-[12px] border border-light-30 bg-transparent text-light-100 placeholder:text-light-30"
                  placeholder={`Max ${suffix}`.trim()}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const newMax = raw === "" ? "" : Number(raw);
                    const currentMin = form.getValues(minName);

                    if (
                      newMax !== "" &&
                      currentMin !== "" &&
                      newMax < currentMin
                    ) {
                      form.setValue(maxName, currentMin, {
                        shouldValidate: true,
                      });
                      form.setValue(minName, newMax, { shouldValidate: true });
                    } else {
                      form.setValue(maxName, newMax, { shouldValidate: true });
                    }
                  }}
                />
              </FormControl>
              <div className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[12px] text-light-60">
                {suffix}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={minName}
        render={() => (
          <FormItem>
            <FormControl>
              <Slider
                min={min}
                max={max}
                step={step}
                value={[minVal, maxVal]}
                onValueChange={(vals) => {
                  const [a, b] = vals;
                  form.setValue(minName, a, { shouldValidate: true });
                  form.setValue(maxName, b, { shouldValidate: true });
                }}
                className="w-full"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
