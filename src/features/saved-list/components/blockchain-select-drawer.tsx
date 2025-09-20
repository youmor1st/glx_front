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
import { CrossIcon, EthereumLogoIcon, SolanaLogoIcon } from "@/shared/ui/icons";
import { RadioGroup } from "@/shared/ui/radio-group";
import { RadioSelectCard } from "@/shared/ui/radio-select-card";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import FilterButton from "./filter-button";

export const formSchema = z.object({
  blockchain: z.string().optional(),
});

interface BlockchainSelectDrawerProps {
  onFilterSubmit: (blockhcain: BlockchainType) => void;
}

export function BlockchainSelectDrawer({
  onFilterSubmit,
}: BlockchainSelectDrawerProps) {
  const isDesktop = usePlatform();
  const [isOpen, setIsOpen] = useState(false);
  useScrollLock(isOpen);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blockchain: "",
    },
    shouldFocusError: false,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    onFilterSubmit(values.blockchain as BlockchainType);
    setIsOpen(false);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      onSubmit(form.getValues());
    }
    setIsOpen(open);
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleOnOpenChange}
      dismissible
      modal={false}
    >
      <DrawerTrigger asChild>
        <FilterButton active={!!form.watch("blockchain")} title="Blockchain" />
      </DrawerTrigger>
      <DrawerCustomOverlay open={isOpen} onClick={() => setIsOpen(false)} />
      <DrawerContent>
        <DrawerHeader className="grid justify-items-stretch grid-rows-1 grid-cols-3">
          <div />
          <DrawerTitle className="text-base font-semibold text-light-100">
            Blockchain
          </DrawerTitle>
          <DrawerClose className="justify-self-end" asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
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
              className="flex flex-col justify-between flex-1 gap-[24px]"
            >
              <div className="flex flex-col gap-[32px]">
                <FormField
                  control={form.control}
                  name="blockchain"
                  render={({ field }) => (
                    <FormItem className="gap-[12px]">
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-col gap-[8px]"
                        >
                          {[
                            ["Ethereum", "ETH"],
                            ["Solana", "SOL"],
                          ].map(([label, value]) => (
                            <RadioSelectCard
                              key={value}
                              label={label}
                              icon={
                                value === "ETH" ? (
                                  <EthereumLogoIcon className="size-6"></EthereumLogoIcon>
                                ) : (
                                  <SolanaLogoIcon className="size-6"></SolanaLogoIcon>
                                )
                              }
                              value={value}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

export default BlockchainSelectDrawer;
