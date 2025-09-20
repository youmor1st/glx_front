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
import { CrossIcon } from "@/shared/ui/icons";
import { RadioGroup } from "@/shared/ui/radio-group";
import { RadioSelectCard } from "@/shared/ui/radio-select-card";
import { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useWizard } from "react-use-wizard";
import { z } from "zod";
import { step1formSchema } from "../pages/add-address-page";

interface Step1Props {
  form: UseFormReturn<z.infer<typeof step1formSchema>>;
  setStep1Data: (data: { blockchain: string; address: string }) => void;
}

export const AddAdressStep1 = ({ form, setStep1Data }: Step1Props) => {
  const { nextStep } = useWizard();
  const navigate = useNavigate();

  function onSubmit(values: z.infer<typeof step1formSchema>) {
    setStep1Data(values);
    nextStep();
  }

  return (
    <div className="flex-1 gap-[32px] flex flex-col">
      <NavHeader
        title="Add new address"
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
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="gap-[12px]">
                  <FormLabel htmlFor="walletAddress" className="text-light-100">
                    Wallet Address
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      name="walletAddress"
                      className="active:bg-transparent w-full px-[12px] py-[16px] rounded-[8px] border border-light-40 text-light-100 placeholder:text-light-40"
                      placeholder="Enter or paste your wallet or token address."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="blockchain"
              render={({ field }) => (
                <FormItem className="gap-[12px]">
                  <FormLabel className="text-light-100">Blockchain</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-col"
                    >
                      {[["Solana", "sol"]].map(([label, value], index) => (
                        <RadioSelectCard
                          key={"blockchain_" + index}
                          label={label}
                          blockchain={value as BlockchainType}
                          value={value}
                        ></RadioSelectCard>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" variant="big" size="big">
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
};
