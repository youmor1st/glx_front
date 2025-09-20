import { isValidEthAddress, isValidSolAddress } from "@/shared/lib/utils";
import PageWrapper from "@/shared/ui/page-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Wizard } from "react-use-wizard";
import { z } from "zod";
import { AddAdressStep1 } from "../components/AddAddressStep1";
import { AddAdressStep2 } from "../components/AddAddressStep2";
import { AddAdressStep3 } from "../components/AddAddressStep3";

export const step1formSchema = z
  .object({
    blockchain: z.string().min(1, "Please select a blockchain"),
    address: z.string().min(1, "Address is required"),
  })
  .superRefine(({ blockchain, address }, ctx) => {
    if (blockchain === "eth" && !isValidEthAddress(address)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Invalid Ethereum address.",
      });
    }

    if (blockchain === "sol" && !isValidSolAddress(address)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Invalid Solana address.",
      });
    }
  });

export const step2formSchema = z
  .object({
    address: z.string(),
    addressName: z
      .string()
      .min(1, "Address name is required")
      .max(50, "Address name cannot be longer than 50 symbols"),
    notificationLimit1: z
      .string()
      .min(1, "Min limit is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid number greater than or equal to 0",
      }),
    notificationLimit2: z
      .string()
      .min(1, "Max limit is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Must be a valid number greater than 0",
      }),
  })
  .superRefine((data, ctx) => {
    const minVal = Number(data.notificationLimit1);
    const maxVal = Number(data.notificationLimit2);

    if (maxVal <= minVal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["notificationLimit2"],
        message: "Max limit must be greater than min limit",
      });
    }
  });

export default function AddAddressPage() {
  const step1Form = useForm<z.infer<typeof step1formSchema>>({
    resolver: zodResolver(step1formSchema),
    defaultValues: {
      blockchain: "",
      address: "",
    },
    shouldFocusError: false,
  });

  const [step1Data, setStep1Data] = useState<{
    blockchain: string;
    address: string;
  } | null>(null);

  return (
    <PageWrapper className="bg-background-0 pb-[48px]!">
      <FormProvider {...step1Form}>
        <Wizard>
          <AddAdressStep1 setStep1Data={setStep1Data} form={step1Form} />
          <AddAdressStep2 step1Data={step1Data!} />
          <AddAdressStep3 />
        </Wizard>
      </FormProvider>
    </PageWrapper>
  );
}
