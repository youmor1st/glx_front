import { usePlatform } from "@/shared/hooks/use-platform";
import useScrollLock from "@/shared/hooks/use-scroll-lock";
import DrawerCustomOverlay from "@/shared/ui/drawer-custom-overlay";
import { Button } from "@/shared/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { CrossIcon } from "@/shared/ui/icons";
import { RadioGroup } from "@/shared/ui/radio-group";
import { RadioSelectCard } from "@/shared/ui/radio-select-card";
import RangeSelectCard from "@/shared/ui/range-select-card";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import FilterButton from "../filter-button";

const formSchema = z
  .object({
    price: z.string().optional(),
    lowerRange: z.string().optional(),
    higherRange: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const minVal = Number(data.lowerRange);
    const maxVal = Number(data.higherRange);

    if (maxVal || minVal) {
      if (maxVal <= minVal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["higherRange"],
          message: "Max limit must be greater than min limit",
        });
      }

      if (isNaN(minVal) || minVal <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["lowerRange"],
          message: "Must be a valid number greater than or equal to 0",
        });
      }

      if (isNaN(maxVal) || maxVal <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["higherRange"],
          message: "Must be a valid number greater than or equal to 0",
        });
      }
    }
  });

export default function TopPriceSelectDrawer() {
  const isDesktop = usePlatform();
  const [open, setOpen] = useState(false);
  useScrollLock(open);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: "",
      lowerRange: "",
      higherRange: "",
    },

    shouldFocusError: false,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setOpen(false);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      onSubmit(form.getValues());
    }
    setOpen(open);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={handleOnOpenChange}
      dismissible
      modal={false}
    >
      <DrawerTrigger asChild>
        <FilterButton
          active={
            !!form.watch("price") ||
            (!!form.watch("higherRange") && !!form.watch("lowerRange"))
          }
          title="Top price"
        />
      </DrawerTrigger>
      <DrawerCustomOverlay open={open} onClick={() => setOpen(false)} />
      <DrawerContent>
        <DrawerHeader className="grid justify-items-stretch grid-rows-1 grid-cols-3">
          <div />
          <DrawerTitle className="text-base font-semibold text-light-100">
            Top Price
          </DrawerTitle>
          <DrawerClose className="justify-self-end" asChild>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <CrossIcon className="fill-light-100 size-6!" />
            </Button>
          </DrawerClose>
          <DrawerDescription className="sr-only">
            Additional information
          </DrawerDescription>
        </DrawerHeader>

        <div
          className={clsx(
            "flex flex-col gap-[16px] w-full px-6 flex-1 justify-center pt-[32px]",
            isDesktop ? "pb-[32px]" : "pb-[48px]"
          )}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col justify-between flex-1 gap-[8px]"
            >
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="gap-[12px]">
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-col gap-[8px]"
                      >
                        {[
                          ["Price: High to Low", "HtL"],
                          ["Price: Low to High", "LtH"],
                        ].map(([label, value]) => (
                          <RadioSelectCard
                            key={value}
                            label={label}
                            value={value}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <RangeSelectCard form={form}></RangeSelectCard>

              <div className="flex gap-[16px]">
                <Button
                  type="button"
                  variant="big"
                  size="big"
                  className="flex-1 bg-light-20"
                  onClick={() => {
                    form.reset();
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="big"
                  size="big"
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}
