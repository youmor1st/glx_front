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

import UseKeyboardOpen from "@/shared/hooks/use-keyboard-open";
import { PlatformsField } from "../components/preset-checkbox-row";
import PresetInputRow from "../components/preset-input-row";
import PresetInputWithSelectRow from "../components/preset-input-with-select-row";
import PresetRadioRow from "../components/preset-radio-row";
import PresetRangeRow from "../components/preset-range-row";
import PresetSelectRow from "../components/preset-select-row";

/** TOKEN: same refine pattern & form wiring as Wallet; only fields differ */
export const tokenFiltersSchema = z
  .object({
    // Metrics
    name: z.string().min(1, "Name is required."),
    emoji: z.string().optional(),

    // Price
    priceMin: z.coerce.number().min(0),
    priceMax: z.coerce.number().optional(),

    platforms: z
      .array(
        z.enum([
          "trenches",
          "pumpfun",
          "bonk",
          "believe",
          "boop",
          "launchlab",
          "moonut",
        ])
      )
      .optional(),

    // Statistics Period
    statisticsPeriod: z.enum(["1H", "6H", "24H", "1D", "7D"], {
      required_error: "Select a period",
    }),

    // Liquidity / Holders / Transactions
    liquidityMin: z.coerce.number().min(0),
    liquidityMax: z.coerce.number().optional(),

    holdersMin: z.coerce.number().min(0),
    holdersMax: z.coerce.number().optional(),

    txsWindow: z.enum(["1M", "5M", "1H", "6H", "24H"]),
    txsMin: z.coerce.number().min(0),
    txsMax: z.coerce.number().optional(),

    // Sort tokens
    sortTokensBy: z.enum(["price", "holders", "volume", "totalFees"]),

    // Payment Parameters (skip checkbox list, keep ranges/toggles)
    smartMin: z.coerce.number().min(0),
    smartMax: z.coerce.number().optional(),
    noMint: z.boolean().default(false),
    blacklist: z.boolean().default(false),
    burntMin: z.coerce.number().min(0),
    burntMax: z.coerce.number().optional(),
    top10Min: z.coerce.number().min(0),
    top10Max: z.coerce.number().optional(),
    bundlersMin: z.coerce.number().min(0),
    bundlersMax: z.coerce.number().optional(),

    // Duration Parameters
    launchpad: z.string().optional(),
    tokenAge: z.enum(["24H", "7D", "30D", "CUSTOM"]),
    tokenAgeMin: z.coerce.number().min(0).optional(),
    tokenAgeMax: z.coerce.number().min(0).optional(),

    // Market Cap Parameters
    mcapMin: z.coerce.number().min(0),
    mcapMax: z.coerce.number().optional(),
    fdvMin: z.coerce.number().min(0),
    fdvMax: z.coerce.number().optional(),

    // Total Fees with currency
    totalFeesMin: z.coerce.number().min(0),
    totalFeesMax: z.coerce.number().optional(),
    totalFeesCurrency: z.enum(["SOL", "ETH"]),

    // Data Export
    exportEvery: z.enum(["4H", "6H", "12H", "24H"]),

    // Advanced Settings
    whaleHoldersMin: z.coerce.number().min(0),
    whaleHoldersMax: z.coerce.number().optional(),
    devHoldersMin: z.coerce.number().min(0),
    devHoldersMax: z.coerce.number().optional(),
    includeRug: z.boolean().default(false),
  })
  .superRefine((v, ctx) => {
    // ⬇️ same helper + pair checks as Wallet page
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

    check("priceMin", "priceMax");
    check("liquidityMin", "liquidityMax");
    check("holdersMin", "holdersMax");
    check("txsMin", "txsMax");
    check("smartMin", "smartMax");
    check("burntMin", "burntMax");
    check("top10Min", "top10Max");
    check("bundlersMin", "bundlersMax");
    check("mcapMin", "mcapMax");
    check("fdvMin", "fdvMax");
    check("totalFeesMin", "totalFeesMax");
    if (v.tokenAge === "CUSTOM") check("tokenAgeMin", "tokenAgeMax");
  });

export type TokenFiltersValues = z.infer<typeof tokenFiltersSchema>;

export const tokenFiltersDefaults: TokenFiltersValues = {
  name: "",
  emoji: "",

  priceMin: 0,
  priceMax: 2,

  platforms: [],

  statisticsPeriod: "24H",

  liquidityMin: 0,
  liquidityMax: 2,

  holdersMin: 0,
  holdersMax: 2,

  txsWindow: "1H",
  txsMin: 0,
  txsMax: 2,

  sortTokensBy: "price",

  smartMin: 0,
  smartMax: 2,
  noMint: false,
  blacklist: false,
  burntMin: 0,
  burntMax: 2,
  top10Min: 0,
  top10Max: 2,
  bundlersMin: 0,
  bundlersMax: 2,

  launchpad: "",
  tokenAge: "24H",
  tokenAgeMin: 0,
  tokenAgeMax: 0,

  mcapMin: 0,
  mcapMax: 2,
  fdvMin: 0,
  fdvMax: 2,

  totalFeesMin: 0,
  totalFeesMax: 2,
  totalFeesCurrency: "SOL",

  exportEvery: "4H",

  whaleHoldersMin: 0,
  whaleHoldersMax: 2,
  devHoldersMin: 0,
  devHoldersMax: undefined,
  includeRug: false,
};

export default function CustomTokenPresetPage() {
  const navigate = useNavigate();
  const { isDesktop } = usePlatform();
  const isKeyboardOpen = UseKeyboardOpen();

  const form = useForm({
    resolver: zodResolver(tokenFiltersSchema),
    defaultValues: tokenFiltersDefaults,
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const [edit, setEdit] = useState<boolean>(true);
  const toggleEdit = () => setEdit((p) => !p);

  const sections = [
    { title: "Metrics", glow: false },
    { title: "Payment Parameters", glow: false },
    { title: "Duration Parameters", glow: false },
    { title: "Market Cap Parameters", glow: false },
    { title: "Data Export", glow: false },
    { title: "Advanced Settings", glow: true },
  ] as const;

  type Section = (typeof sections)[number]["title"];
  const [selectedSections, setSelected] = useState<Section[]>([]);
  const toggleSection = (s: Section) =>
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  return (
    <div className="pb-[200px] ">
      <NavHeader
        className={twMerge(
          "sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto ",
          isDesktop ? "pt-[40px]" : "pt-[100px]"
        )}
        title="Top Token Filters"
        left={
          <Button onClick={() => navigate(-1)}>
            <ArrowIcon className="size-6 fill-light-100" />
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
        {sections.map((s) => (
          <FilterButton
            key={s.title}
            hideArrow
            title={s.title}
            active={selectedSections.includes(s.title)}
            onClick={() => toggleSection(s.title)}
            glow={s.glow}
          />
        ))}
      </div>

      <div className="w-full ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              console.log("Submit:", values)
            )}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            className="flex flex-col justify-between flex-1 gap-[24px]"
          >
            {(selectedSections.includes("Metrics") ||
              selectedSections.length === 0) && (
              <div className="flex w-full flex-col gap-[20px] bg-background-8 rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] p-[20px]">
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
                <div className="h-[1px] w-full bg-light-16" />
                <PresetInputRow
                  displayName="Emoji"
                  name="emoji"
                  placeholder="e.g., 🔍"
                  form={form}
                  open={edit}
                  type="text"
                />
                <div className="h-[1px] w-full bg-light-16" />

                {/* Price */}
                <div className="flex flex-col gap-[12px] w-full">
                  <FormLabel className="text-light-100">Price</FormLabel>
                  <div className="flex items-center gap-[4px] w-full">
                    <PresetInputRow
                      name="priceMin"
                      placeholder="Min"
                      form={form}
                      open={edit}
                      type="number"
                    />
                    <div className="bg-light-40 w-[12px] h-[1px]" />
                    <PresetInputRow
                      name="priceMax"
                      placeholder="Max"
                      form={form}
                      open={edit}
                      type="number"
                    />
                  </div>
                </div>

                <PlatformsField
                  form={form}
                  name="platforms"
                  open={edit}
                  options={[
                    { label: "Trenches", value: "trenches" },
                    { label: "Pump.fun", value: "pumpfun" },
                    { label: "Bonk", value: "bonk" },
                    { label: "Believe", value: "believe" },
                    { label: "Boop", value: "boop" },
                    { label: "Launchlab", value: "launchlab" },
                    { label: "Moonit", value: "moonut" },
                  ]}
                />

                <div className="h-[1px] w-full bg-light-16" />
                <PresetSelectRow
                  name="statisticsPeriod"
                  label="Statistics Period"
                  open={edit}
                  options={[
                    { label: "1H", value: "1H" },
                    { label: "6H", value: "6H" },
                    { label: "24H", value: "24H" },
                    { label: "1D", value: "1D" },
                    { label: "7D", value: "7D" },
                  ]}
                />

                <div className="h-[1px] w-full bg-light-16" />
                <PresetRangeRow
                  label="Liquidity"
                  minName="liquidityMin"
                  maxName="liquidityMax"
                  form={form}
                  open={edit}
                />

                <div className="h-[1px] w-full bg-light-16" />
                <PresetRangeRow
                  label="Holders"
                  minName="holdersMin"
                  maxName="holdersMax"
                  form={form}
                  open={edit}
                />

                <div className="h-[1px] w-full bg-light-16" />
                <PresetSelectRow
                  name="txsWindow"
                  label="Transactions Window"
                  open={edit}
                  options={[
                    { label: "1M", value: "1M" },
                    { label: "5M", value: "5M" },
                    { label: "1H", value: "1H" },
                    { label: "6H", value: "6H" },
                    { label: "24H", value: "24H" },
                  ]}
                />
                <PresetRangeRow
                  label="Transactions"
                  minName="txsMin"
                  maxName="txsMax"
                  form={form}
                  open={edit}
                />

                <div className="h-[1px] w-full bg-light-16" />
                <PresetRadioRow
                  name="sortTokensBy"
                  displayName="Sort Tokens by"
                  form={form}
                  open={edit}
                  options={[
                    { label: "Price", value: "price" },
                    { label: "Holders", value: "holders" },
                    { label: "Volume", value: "volume" },
                    { label: "Total Fees", value: "totalFees" },
                  ]}
                />
              </div>
            )}

            {(selectedSections.includes("Payment Parameters") ||
              selectedSections.length === 0) && (
              <div className="flex w-full flex-col gap-[20px] bg-background-8 rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] p-[20px]">
                <h2 className="text-[20px] font-[700] text-light-100">
                  Payment Parameters
                </h2>

                <PresetRangeRow
                  label="Smart"
                  minName="smartMin"
                  maxName="smartMax"
                  form={form}
                  open={edit}
                />

                <div className="h-[1px] w-full bg-light-16" />
                {/* Keep as radios for now—flip to Switch if you have it */}
                <PresetRadioRow
                  name="noMint"
                  displayName="No Mint"
                  form={form as any}
                  open={edit}
                  options={[
                    { label: "Enabled", value: true as any },
                    { label: "Disabled", value: false as any },
                  ]}
                />
                <PresetRadioRow
                  name="blacklist"
                  displayName="Blacklist"
                  form={form as any}
                  open={edit}
                  options={[
                    { label: "Enabled", value: true as any },
                    { label: "Disabled", value: false as any },
                  ]}
                />

                <div className="h-[1px] w-full bg-light-16" />
                <PresetRangeRow
                  label="Burnt (%)"
                  minName="burntMin"
                  maxName="burntMax"
                  form={form}
                  open={edit}
                />

                <div className="h-[1px] w-full bg-light-16" />
                <PresetRangeRow
                  label="Top 10 (%)"
                  minName="top10Min"
                  maxName="top10Max"
                  form={form}
                  open={edit}
                />

                <div className="h-[1px] w-full bg-light-16" />
                <PresetRangeRow
                  label="Bundlers (%)"
                  minName="bundlersMin"
                  maxName="bundlersMax"
                  form={form}
                  open={edit}
                />
              </div>
            )}

            {(selectedSections.includes("Duration Parameters") ||
              selectedSections.length === 0) && (
              <div className="flex w-full flex-col gap-[20px] bg-background-8 rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] p-[20px]">
                <h2 className="text-[20px] font-[700] text-light-100">
                  Duration Parameters
                </h2>

                <PresetInputRow
                  displayName="Launchpad"
                  name="launchpad"
                  placeholder="Enter platform (e.g., Binance)"
                  form={form}
                  open={edit}
                />

                <div className="h-[1px] w-full bg-light-16" />
                <PresetRadioRow
                  name="tokenAge"
                  displayName="Token Age"
                  form={form}
                  open={edit}
                  options={[
                    { label: "24H", value: "24H" },
                    { label: "7D", value: "7D" },
                    { label: "30D", value: "30D" },
                    { label: "Custom", value: "CUSTOM" },
                  ]}
                />
                <PresetRangeRow
                  label="Custom (days)"
                  minName="tokenAgeMin"
                  maxName="tokenAgeMax"
                  form={form}
                  open={edit}
                />
              </div>
            )}

            {(selectedSections.includes("Market Cap Parameters") ||
              selectedSections.length === 0) && (
              <div className="flex w-full flex-col gap-[20px] bg-background-8 rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] p-[20px]">
                <h2 className="text-[20px] font-[700] text-light-100">
                  Market Cap Parameters
                </h2>

                <PresetRangeRow
                  label="Market Cap"
                  minName="mcapMin"
                  maxName="mcapMax"
                  form={form}
                  open={edit}
                />

                <div className="h-[1px] w-full bg-light-16" />
                <PresetRangeRow
                  label="FDV (Fully Diluted Valuation)"
                  minName="fdvMin"
                  maxName="fdvMax"
                  form={form}
                  open={edit}
                />

                <div className="h-[1px] w-full bg-light-16" />
                <div className="flex flex-col gap-[12px] w-full">
                  <FormLabel className="text-light-100">Total Fees</FormLabel>
                  <div className="flex items-center gap-[4px] w-full">
                    <PresetInputWithSelectRow
                      name="totalFeesMin"
                      selectName="totalFeesCurrency"
                      form={form}
                      placeholder="Min"
                      options={[
                        { label: "SOL", value: "SOL" },
                        { label: "ETH", value: "ETH" },
                      ]}
                      open={edit}
                    />
                    <div className="bg-light-40 w-[12px] h-[1px]" />
                    <PresetInputWithSelectRow
                      name="totalFeesMax"
                      selectName="totalFeesCurrency"
                      form={form}
                      placeholder="Max"
                      options={[
                        { label: "SOL", value: "SOL" },
                        { label: "ETH", value: "ETH" },
                      ]}
                      open={edit}
                    />
                  </div>
                </div>
              </div>
            )}

            {(selectedSections.includes("Data Export") ||
              selectedSections.length === 0) && (
              <div className="flex w-full flex-col gap-[20px] bg-background-8 rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] p-[20px]">
                <h2 className="text-[20px] font-[700] text-light-100">
                  Data Export
                </h2>
                <PresetRadioRow
                  name="exportEvery"
                  displayName="Export Wallets Every"
                  form={form}
                  open={edit}
                  options={[
                    { label: "4H", value: "4H" },
                    { label: "6H", value: "6H" },
                    { label: "12H", value: "12H" },
                    { label: "24H", value: "24H" },
                  ]}
                />
              </div>
            )}

            {(selectedSections.includes("Advanced Settings") ||
              selectedSections.length === 0) && (
              <div
                className="flex w-full flex-col gap-[24px] rounded-[16px] sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] p-[20px]"
                style={{
                  background:
                    "linear-gradient(221.52deg, #0F074A 23.48%, #4B186A 91.73%)",
                }}
              >
                <h2 className="text-[20px] font-[700] text-light-100">
                  Advanced Settings
                </h2>
                <PresetRangeRow
                  label="Whale Holders"
                  minName="whaleHoldersMin"
                  maxName="whaleHoldersMax"
                  form={form}
                  open={edit}
                />
                <div className="h-[1px] w-full bg-light-16" />
                <PresetRangeRow
                  label="Dev Holders"
                  minName="devHoldersMin"
                  maxName="devHoldersMax"
                  form={form}
                  open={edit}
                />
                <div className="h-[1px] w-full bg-light-16" />
                {/* keep as radios (can switch to your Switch component later) */}
                <PresetRadioRow
                  name="includeRug"
                  displayName="Include RUG"
                  form={form as any}
                  open={edit}
                  options={[
                    { label: "Yes", value: true as any },
                    { label: "No", value: false as any },
                  ]}
                />
              </div>
            )}

            {/* sticky submit */}
            <div
              className={twMerge(
                "w-full flex justify-center p-[16px] bg-[#1A193266] backdrop-blur-md rounded-t-[20px] fixed z-50 left-0 right-0",
                isKeyboardOpen
                  ? "bottom-0"
                  : "bottom-[calc(env(safe-area-inset-bottom)+82px)]"
              )}
            >
              <Button
                disabled={!form.formState.isValid}
                type="submit"
                className={twMerge(
                  "sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto self-center"
                )}
                variant="big"
                size="big"
              >
                Apply Filters
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
