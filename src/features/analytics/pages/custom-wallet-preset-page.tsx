import NavHeader from "@/features/navigation/components/nav-header";
import FilterButton from "@/features/saved-list/components/filter-button";
import { usePlatform } from "@/shared/hooks/use-platform";
import { Button } from "@/shared/ui/button";
import { Form, FormLabel } from "@/shared/ui/form";
import { ArrowIcon, PencilIcon, StarIcon } from "@/shared/ui/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import PresetInputRow from "../components/preset-input-row";

import PresetInputWithSelectRow from "../components/preset-input-with-select-row";
import PresetRadioRow from "../components/preset-radio-row";
import PresetRangeRow from "../components/preset-range-row";
import PresetRangeSliderRow from "../components/preset-range-slider-row";
import PresetSelectRow from "../components/preset-select-row";
import PresetSliderRow from "../components/preset-slider-row";
import UseKeyboardOpen from "@/shared/hooks/use-keyboard-open";

//todo: export into file
export const metricsFormSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    emoji: z.string().optional(),
    statisticsPeriod: z.enum(["1D", "7D", "30D"], {
      required_error: "Select a period",
    }),

    minTradeThreshold: z.coerce
      .number({ required_error: "Required" })
      .nonnegative("Must be ≥ 0"),
    thresholdCurrency: z.literal("SOL"),

    winRateMin: z.coerce.number().min(0).max(100),
    winRateMax: z.coerce.number().min(0).max(100),

    pnlMin: z.coerce.number().min(-10000).max(1000000),
    pnlMax: z.coerce.number().min(-10000).max(1000000),

    roiMin: z.coerce.number().min(-10000).max(1000000),
    roiMax: z.coerce.number().min(-10000).max(1000000),

    swapsMin: z.coerce.number().min(0).max(100000),
    swapsMax: z.coerce.number().min(0).max(100000),

    rocketMultiplier: z.coerce.number().min(1).max(100),
    rocketSlider: z.coerce.number().min(1).max(100),

    fastTradeMin: z.coerce.number().min(-10000).max(1000000),
    fastTradeMax: z.coerce.number().min(-10000).max(1000000),

    avgBuyMin: z.coerce.number().min(0),
    avgBuyMax: z.coerce.number().min(0),
    avgBuyCurrency: z.enum(["SOL", "ETH"]),

    medianBuyMin: z.coerce.number().min(0),
    medianBuyMax: z.coerce.number().min(0),
    medianBuyCurrency: z.enum(["SOL", "ETH"]),

    balanceMin: z.coerce.number().min(0),
    balanceMax: z.coerce.number().min(0),
    balanceCurrency: z.enum(["SOL", "ETH"]),

    maxUnfinishedTrades: z.coerce.number().min(0).max(100),

    sortBy: z.enum(["roi", "medianRoi", "rockets", "lastTradeDay"]),

    avgTradeDurationMin: z.coerce.number().min(0),
    avgTradeDurationMax: z.coerce.number().min(0),

    medianTradeDurationMin: z.coerce.number().min(0),
    medianTradeDurationMax: z.coerce.number().min(0),

    tradesMin: z.coerce.number().min(0),
    tradesMax: z.coerce.number().min(0),

    avgMcapMin: z.coerce.number().min(0),
    avgMcapMax: z.coerce.number().optional(),

    maxSoldOverBought: z.coerce.number().min(0).max(100),
    exportEvery: z.enum(["6H", "12H", "24H", "48H"]),

    maximumDrawdown: z.coerce.number().min(0).optional(),
    recoveryTime: z.coerce.number().min(0).optional(),
    profitFactor: z.coerce.number().min(0).optional(),
    averageHoldTimeAnalysis: z.coerce.number().min(0).optional(),
    earlyEntryScore: z.coerce.number().min(0).max(100).optional(),
  })
  .superRefine((v, ctx) => {
    const check = (minKey: keyof typeof v, maxKey: keyof typeof v) => {
      const min = v[minKey] as unknown as number | undefined;
      const max = v[maxKey] as unknown as number | undefined;
      if (min !== undefined && max !== undefined && max < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [maxKey as string],
          message: "Max must be ≥ Min",
        });
      }
    };

    check("winRateMin", "winRateMax");
    check("pnlMin", "pnlMax");
    check("roiMin", "roiMax");
    check("swapsMin", "swapsMax");
    check("fastTradeMin", "fastTradeMax");
    check("avgBuyMin", "avgBuyMax");
    check("medianBuyMin", "medianBuyMax");
    check("balanceMin", "balanceMax");
    check("avgTradeDurationMin", "avgTradeDurationMax");
    check("medianTradeDurationMin", "medianTradeDurationMax");
    check("tradesMin", "tradesMax");
    if (v.avgMcapMax !== undefined) check("avgMcapMin", "avgMcapMax");
  });

export type MetricsFormValues = z.infer<typeof metricsFormSchema>;

export const metricsDefaultValues: MetricsFormValues = {
  name: "",
  emoji: "🧠",
  statisticsPeriod: "1D",
  minTradeThreshold: 0.01,
  thresholdCurrency: "SOL",

  winRateMin: 50,
  winRateMax: 100,

  pnlMin: 10,
  pnlMax: 400,

  roiMin: 10,
  roiMax: 400,

  swapsMin: 0,
  swapsMax: 999,

  rocketMultiplier: 50,
  rocketSlider: 50,

  fastTradeMin: 0,
  fastTradeMax: 100,

  avgBuyMin: 0.1,
  avgBuyMax: 100,
  avgBuyCurrency: "SOL",

  medianBuyMin: 0.2,
  medianBuyMax: 120,
  medianBuyCurrency: "SOL",
  balanceMin: 0.1,
  balanceMax: 100,
  balanceCurrency: "SOL",

  maxUnfinishedTrades: 70,

  sortBy: "roi",

  avgTradeDurationMin: 10,
  avgTradeDurationMax: 100,

  medianTradeDurationMin: 10,
  medianTradeDurationMax: 100,

  tradesMin: 10,
  tradesMax: 10000,

  avgMcapMin: 10,
  avgMcapMax: 100,

  maxSoldOverBought: 20,
  exportEvery: "6H",

  maximumDrawdown: 0,
  recoveryTime: 0,
  profitFactor: 0,
  averageHoldTimeAnalysis: 0,
  earlyEntryScore: 0,
};

export default function CustomWalletPresetPage() {
  const navigate = useNavigate();
  const { isDesktop } = usePlatform();

  const form = useForm<MetricsFormValues>({
    resolver: zodResolver(metricsFormSchema),
    defaultValues: metricsDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const [edit, setEdit] = useState<boolean>(true);

  const toggleEdit = () => {
    setEdit((prev) => !prev);
  };

  const sections: Section[] = [
    { title: "Metrics", glow: false },
    { title: "Payment Parameters", glow: false },
    { title: "Duration Parameters", glow: false },
    { title: "Market Cap Parameters", glow: false },
    { title: "Data Export", glow: false },
    { title: "Advanced Settings", glow: true },
  ] as const;

  interface Section {
    title: string;
    glow: boolean;
  }

  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setSelectedSections((prev) => {
      if (prev.includes(section)) {
        return prev.filter((s) => s !== section);
      } else {
        return [...prev, section];
      }
    });
  };

  const isKeyboardOpen = UseKeyboardOpen();

  return (
    <div className="pb-[200px] ">
      <NavHeader
        className={twMerge(
          "sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto ",
          isDesktop ? "pt-[40px]" : "pt-[100px]"
        )}
        title="Top Wallet Presets"
        left={
          <Button onClick={() => navigate("/wallet-presets")}>
            <ArrowIcon className="size-6 fill-white" />
          </Button>
        }
        right={
          <div className="flex gap-[8px]">
            <Button onClick={() => toggleEdit()}>
              <PencilIcon
                className={twMerge(
                  "size-[24px]",
                  edit ? "fill-violet-accent" : "fill-light-100"
                )}
              />
            </Button>
            <Button>
              <StarIcon className="size-[24px] fill-violet-accent" />
            </Button>
          </div>
        }
      />

      <div className="flex gap-[8px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto py-[16px] overflow-x-scroll scrollbar-hidden">
        {sections.map((section) => (
          <FilterButton
            key={section.title}
            hideArrow
            title={section.title}
            active={selectedSections.includes(section.title)}
            onClick={() => toggleSection(section.title)}
            glow={section.glow}
          />
        ))}
      </div>

      <div className="w-full ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              // TODO: replace with  submit logic
              console.log("Submit:", values);
            })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className="flex flex-col  justify-between flex-1 gap-[24px] "
          >
            {(selectedSections.includes("Metrics") ||
              selectedSections.length === 0) && (
              <div className="flex w-full flex-col gap-[20px]  bg-background-8 rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto p-[20px]">
                <h2 className="text-[20px] font-[700] text-light-100">
                  Metrics
                </h2>
                <PresetInputRow
                  displayName="Name"
                  name="name"
                  placeholder="Enter preset name"
                  form={form}
                  open={edit}
                  type="text"
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetInputRow
                  displayName="Emoji"
                  name="emoji"
                  placeholder="e.g., 🧠"
                  form={form}
                  open={edit}
                  type="text"
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetSelectRow
                  name="statisticsPeriod"
                  label="Statistics Period"
                  open={edit}
                  options={[
                    { label: "1 D", value: "1D" },
                    { label: "7 D", value: "7D" },
                    { label: "30 D", value: "30D" },
                  ]}
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetInputWithSelectRow
                  name="minTradeThreshold"
                  selectName="thresholdCurrency"
                  displayName="Ignore trades lower than this value for stat calculations"
                  form={form}
                  placeholder="0.01"
                  options={[
                    { label: "SOL", value: "SOL" },
                    { label: "ETH", value: "ETH" },
                  ]}
                  open={edit}
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetRangeRow
                  label="Win Rate (%)"
                  minName="winRateMin"
                  maxName="winRateMax"
                  form={form}
                  open={edit}
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetRangeRow
                  label="PnL (%)"
                  minName="pnlMin"
                  maxName="pnlMax"
                  form={form}
                  open={edit}
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetRangeRow
                  label="ROI (%)"
                  minName="roiMin"
                  maxName="roiMax"
                  form={form}
                  open={edit}
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetRangeRow
                  label="Swaps"
                  minName="swapsMin"
                  maxName="swapsMax"
                  step={1}
                  min={0}
                  form={form}
                  open={edit}
                />
              </div>
            )}

            {(selectedSections.includes("Payment Parameters") ||
              selectedSections.length === 0) && (
              <div className="flex w-full flex-col gap-[20px]  bg-background-8 rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto p-[20px]">
                <h2 className="text-[20px] font-[700] text-light-100">
                  Payment Parameters
                </h2>

                <div className="rounded-[8px] flex flex-col gap-[20px]">
                  <PresetInputRow
                    displayName="Rocket "
                    name="rocketMultiplier"
                    placeholder="50"
                    form={form}
                    open={edit}
                    prefix="x"
                    type="number"
                  />
                  <PresetSliderRow
                    name="rocketSlider"
                    form={form}
                    open={edit}
                    min={1}
                    max={100}
                    step={1}
                    mirrorTo="rocketMultiplier"
                  />
                  <div className="h-[1px] w-full bg-light-16"></div>
                  <PresetRangeRow
                    label="Fast trade is trade < 1min"
                    minName="fastTradeMin"
                    maxName="fastTradeMax"
                    form={form}
                    open={edit}
                  ></PresetRangeRow>
                  <div className="h-[1px] w-full bg-light-16"></div>
                  <div className="flex flex-col gap-[12px] w-full">
                    <FormLabel className="text-light-100">Median Buy</FormLabel>
                    <div className="flex items-center gap-[4px] w-full">
                      <PresetInputWithSelectRow
                        name="medianBuyMin"
                        selectName="medianBuyCurrency"
                        form={form}
                        placeholder="0.2"
                        options={[
                          { label: "SOL", value: "SOL" },
                          { label: "ETH", value: "ETH" },
                        ]}
                        open={edit}
                      />
                      <div className="bg-light-40 w-[12px] h-[1px]"></div>
                      <PresetInputWithSelectRow
                        name="medianBuyMax"
                        selectName="medianBuyCurrency"
                        form={form}
                        placeholder="120"
                        options={[
                          { label: "SOL", value: "SOL" },
                          { label: "ETH", value: "ETH" },
                        ]}
                        open={edit}
                      />
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-light-16"></div>
                  <div className="flex flex-col gap-[12px] w-full">
                    <FormLabel className="text-light-100">Balance</FormLabel>
                    <div className="flex items-center gap-[4px] w-full">
                      <PresetInputWithSelectRow
                        name="balanceMin"
                        selectName="balanceCurrency"
                        form={form}
                        placeholder="0.1"
                        options={[
                          { label: "SOL", value: "SOL" },
                          { label: "ETH", value: "ETH" },
                        ]}
                        open={edit}
                      />
                      <div className="bg-light-40 w-[12px] h-[1px] "></div>
                      <PresetInputWithSelectRow
                        name="balanceMax"
                        selectName="balanceCurrency"
                        form={form}
                        placeholder="100"
                        options={[
                          { label: "SOL", value: "SOL" },
                          { label: "ETH", value: "ETH" },
                        ]}
                        open={edit}
                      />
                    </div>
                  </div>
                  <div className="h-[1px] w-full bg-light-16"></div>
                  <PresetInputRow
                    displayName="Max % of trades that are not finished yet"
                    name="maxUnfinishedTrades"
                    placeholder="e.g. 70%"
                    form={form}
                    open={edit}
                    type="number"
                  />
                  <div className="h-[1px] w-full bg-light-16"></div>
                  <PresetRadioRow
                    name="sortBy"
                    displayName="Sort Wallets by"
                    form={form}
                    open={edit}
                    options={[
                      { label: "ROI", value: "roi" },
                      { label: "MEDIAN ROI", value: "medianRoi" },
                      { label: "ROCKETS", value: "rockets" },
                      { label: "LAST TRADE DAY", value: "lastTradeDay" },
                    ]}
                  />
                </div>
              </div>
            )}

            {(selectedSections.includes("Duration Parameters") ||
              selectedSections.length === 0) && (
              <div className="flex w-full flex-col gap-[20px]  bg-background-8 rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto p-[20px]">
                <h2 className="text-[20px] font-[700] text-light-100">
                  Duration Parameters
                </h2>

                <PresetRangeSliderRow
                  label="Avg Trade Duration"
                  minName="avgTradeDurationMin"
                  maxName="avgTradeDurationMax"
                  form={form}
                  open={edit}
                  min={0}
                  max={300}
                  step={1}
                  suffix="min"
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetRangeSliderRow
                  label="Median Trade Duration"
                  minName="medianTradeDurationMin"
                  maxName="medianTradeDurationMax"
                  form={form}
                  open={edit}
                  min={0}
                  max={300}
                  step={1}
                  suffix="min"
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetRangeRow
                  label="Trades"
                  minName="tradesMin"
                  maxName="tradesMax"
                  form={form}
                  open={edit}
                  step={1}
                  min={0}
                />
              </div>
            )}

            {(selectedSections.includes("Market Cap Parameters") ||
              selectedSections.length === 0) && (
              <div className="flex w-full flex-col gap-[20px]  bg-background-8 rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto p-[20px]">
                <h2 className="text-[20px] font-[700] text-light-100">
                  Market Cap Parameters
                </h2>
                <PresetRangeRow
                  label="Avg MCAP"
                  minName="avgMcapMin"
                  maxName="avgMcapMax"
                  form={form}
                  open={edit}
                  step={1}
                  min={0}
                />
              </div>
            )}

            {/* Data Export Section */}
            {(selectedSections.includes("Data Export") ||
              selectedSections.length === 0) && (
              <div className="flex w-full flex-col gap-[20px]  bg-background-8 rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto p-[20px]">
                <h2 className="text-[20px] font-[700] text-light-100">
                  Data Export
                </h2>

                <PresetInputRow
                  displayName="Max Sold > Bought (%)"
                  name="maxSoldOverBought"
                  placeholder="20"
                  form={form}
                  open={edit}
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetRadioRow
                  name="exportEvery"
                  displayName="Export Wallets Every"
                  form={form}
                  open={edit}
                  options={[
                    { label: "6H", value: "6H" },
                    { label: "12H", value: "12H" },
                    { label: "24H", value: "24H" },
                    { label: "48H", value: "48H" },
                  ]}
                />
              </div>
            )}

            {(selectedSections.includes("Advanced Settings") ||
              selectedSections.length === 0) && (
              <div
                className="flex w-full flex-col gap-[24px] rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto p-[20px]"
                style={{
                  background:
                    "linear-gradient(221.52deg, #0F074A 23.48%, #4B186A 91.73%)",
                }}
              >
                <h2 className="text-[20px] font-[700] text-light-100">
                  Advanced Settings
                </h2>

                <PresetInputRow
                  displayName="Maximum Drawdown"
                  name="maximumDrawdown"
                  placeholder="-"
                  form={form}
                  open={edit}
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetInputRow
                  displayName="Recovery Time"
                  name="recoveryTime"
                  placeholder="-"
                  form={form}
                  open={edit}
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetInputRow
                  displayName="Profit Factor"
                  name="profitFactor"
                  placeholder="-"
                  form={form}
                  open={edit}
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetInputRow
                  displayName="Average Hold Time Analysis"
                  name="averageHoldTimeAnalysis"
                  placeholder="-"
                  form={form}
                  open={edit}
                />
                <div className="h-[1px] w-full bg-light-16"></div>
                <PresetInputRow
                  displayName="Early Entry Score"
                  name="earlyEntryScore"
                  placeholder="-"
                  form={form}
                  open={edit}
                />
              </div>
            )}

            <div
              className={twMerge(
                "w-full flex justify-center p-[16px] bg-[#1A193266] backdrop-blur-md rounded-t-[20px]  fixed z-50",
                isKeyboardOpen
                  ? "bottom-0"
                  : "bottom-[calc(env(safe-area-inset-bottom)+82px)]"
              )}
            >
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className={twMerge(
                  "sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto self-center"
                )}
                variant="big"
                size="big"
              >
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
