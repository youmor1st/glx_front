import { createUserWallet } from "@/api/wallets-api";
import NavHeader from "@/features/navigation/components/nav-header";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { ArrowIcon, CrossIcon, TooltipIcon } from "@/shared/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useWizard } from "react-use-wizard";
import { z } from "zod";
import { step2formSchema } from "../pages/add-address-page";
import { useState } from "react";

interface Step2Props {
  step1Data: { blockchain: string; address: string };
}

export const AddAdressStep2 = ({ step1Data }: Step2Props) => {
  const { previousStep, nextStep } = useWizard();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof step2formSchema>>({
    resolver: zodResolver(step2formSchema),
    defaultValues: {
      address: step1Data.address,
      addressName: "",
      notificationLimit1: "",
      notificationLimit2: "",
    },
    shouldFocusError: false,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create_user_wallet"],
    mutationFn: (val: any) => createUserWallet(val),
  });

  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof step2formSchema>) {
    try {
      setServerError(null);

      const payload = {
        blockchainSymbol: step1Data?.blockchain.toUpperCase(),
        address: step1Data?.address,
        filterName: values.addressName,
        filter: "Wallet",
        rule: {
          minAmount: {
            currencyCode: "USD",
            units: values.notificationLimit1,
            nanos: 0,
          },
          maxAmount: {
            currencyCode: "USD",
            units: values.notificationLimit2,
            nanos: 0,
          },
        },
      };

      await mutateAsync(payload);
      nextStep();
    } catch (error: any) {
      console.error("Form submission error", error);
      console.log(error.response.data);
      if (error.status === 409) {
        form.setError("address", {
          type: "serrver",
          message: "Wallet with this address already exists.",
        });
      } else if (error.status === 429) {
        setServerError("Your wallets limit is exceeded.");
      } else {
        setServerError("Something went wrong. Please try again later.");
      }
    }
  }

  return (
    <div className="flex-1 gap-[32px] flex flex-col">
      <NavHeader
        title="New token address"
        left={
          <Button onClick={() => previousStep()}>
            <ArrowIcon className="size-6 fill-light-100" />
          </Button>
        }
        right={
          <Button onClick={() => navigate("/home")}>
            <CrossIcon className="size-6 fill-light-100" />
          </Button>
        }
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between flex-1 gap-[24px]"
        >
          <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[12px]">
              <label className="text-light-100 text-sm font-medium">
                Blockchain
              </label>
              <input
                className="active:bg-transparent w-full px-[12px] py-[16px] rounded-[8px] border border-light-40 text-light-60 placeholder:text-light-40"
                placeholder="Enter or paste your wallet or token address."
                disabled
                value={step1Data.blockchain === "eth" ? "Ethereum" : "Solana"}
                name="blockchain"
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              disabled
              render={({ field }) => (
                <FormItem className="gap-[12px]">
                  <FormLabel htmlFor="walletAddress" className="text-light-100">
                    Wallet Address
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      name="walletAddress"
                      className="active:bg-transparent w-full px-[12px] py-[16px] rounded-[8px] border border-light-40 text-light-40 placeholder:text-light-40"
                      placeholder="Enter or paste your wallet or token address."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressName"
              render={({ field }) => (
                <FormItem className="gap-[12px]">
                  <FormLabel className="text-light-100">Address Name</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="active:bg-transparent w-full px-[12px] py-[16px] rounded-[8px] border border-light-40 text-light-100 placeholder:text-light-40"
                      placeholder="Enter name here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-[12px]">
              <h2 className="text-light-100 flex items-center gap-[4px]">
                Notification Limit
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="flex justify-center items-center">
                      <TooltipIcon className="size-[16px]" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-background-8 text-light-100">
                    Notification limit
                  </PopoverContent>
                </Popover>
              </h2>
              <div className="flex gap-[12px] w-full items-start">
                <FormField
                  control={form.control}
                  name="notificationLimit1"
                  render={({ field }) => (
                    <FormItem className="gap-[12px] flex-1 relative">
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          className="active:bg-transparent w-full pt-[25px] pb-[7px] px-[16px] rounded-[8px] border border-light-40 text-light-100 placeholder:text-light-40"
                          placeholder="0"
                        />
                      </FormControl>
                      <FormMessage />
                      <FormLabel className="absolute top-[8px] left-[16px] text-light-40 text-[12px] font-medium">
                        Min
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notificationLimit2"
                  render={({ field }) => (
                    <FormItem className="gap-[12px] flex-1 relative">
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          className="active:bg-transparent w-full pt-[25px] pb-[7px] px-[16px] rounded-[8px] border border-light-40 text-light-100 placeholder:text-light-40"
                          placeholder="10,000+"
                        />
                      </FormControl>
                      <FormMessage />
                      <FormLabel className="absolute top-[8px] left-[16px] text-light-40 text-[12px] font-medium">
                        Max
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {serverError && (
              <p className="text-indicator-red text-md font-medium">
                {serverError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="big"
            size="big"
            disabled={isPending}
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};
