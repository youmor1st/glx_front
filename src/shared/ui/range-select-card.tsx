import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Label } from "./label";
import { Switch } from "./switch";

interface RangeSelectCardProps {
  form: any;
}

export default function RangeSelectCard({ form }: RangeSelectCardProps) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(48);
  const hasError =
    !!form.formState.errors.lowerRange || !!form.formState.errors.higherRange;

  useEffect(() => {
    open ? (hasError ? setHeight(160) : setHeight(120)) : setHeight(48);
  }, [open, hasError]);

  useEffect(() => {
    if (form.getValues().higherRange || form.getValues().lowerRange) {
      setOpen(true);
    } else if (!form.getValues().higherRange && !form.getValues().lowerRange) {
      setOpen(false);
    }
  }, [form.getValues().higherRange!, form.getValues().lowerRange!]);

  const handleSwitchToggle = (value: boolean) => {
    if (!value) {
      form.resetField("lowerRange");
      form.resetField("higherRange");
    }
    setOpen(value);
  };

  return (
    <motion.div
      animate={{ height }}
      transition={{ duration: 0.01 }}
      className="overflow-hidden relative flex  flex-col gap-[8px] border border-light-30 bg-light-10 rounded-[8px] space-x-3 space-y-0 h-[48px] px-[12px] transition-all"
    >
      <div className="flex flex-row-reverse items-center h-[48px] m-0">
        <Label
          htmlFor="range"
          className="font-normal absolute text-light-100 top-0 left-[16px] cursor-pointer w-full h-[48px] m-0"
        >
          Set Custom Range
        </Label>
        <Switch
          id="range"
          checked={open}
          onCheckedChange={handleSwitchToggle}
        ></Switch>
      </div>

      {open && (
        <div className="flex flex-col gap-[16px]">
          <div className="flex gap-[12px] w-full items-start ">
            <FormField
              control={form.control}
              name="lowerRange"
              render={({ field }) => (
                <FormItem className="gap-[8px] flex-1 relative">
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      className="text-[12px] active:bg-transparent h-[48px]  w-full pt-[25px] pb-[10px] px-[16px] rounded-[8px] border border-light-40 text-light-100 placeholder:text-light-40"
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage className="text-[12px]" />
                  <FormLabel className="absolute top-[8px]  left-[16px] text-light-40 text-[10px] font-medium">
                    Min
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="higherRange"
              render={({ field }) => (
                <FormItem className="gap-[8px] flex-1 relative">
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      className="text-[12px] active:bg-transparent w-full h-[48px] pt-[25px] pb-[10px] px-[16px] rounded-[8px] border border-light-40 text-light-100 placeholder:text-light-40"
                      placeholder="10,000+"
                    />
                  </FormControl>
                  <FormMessage className="text-[12px]" />
                  <FormLabel className="absolute top-[8px] left-[16px] text-light-40 text-[10px] font-medium">
                    Max
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
