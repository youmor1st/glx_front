import PageWrapper from "@/shared/ui/page-wrapper";
import { Button } from "@/shared/ui/button";
import { RadioGroup } from "@/shared/ui/radio-group";
import { RadioGroupItem } from "@/shared/ui/radio-group";
import { Label } from "@/shared/ui/label";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type Tier = {
    id: "1" | "3" | "6";
    label: string;
    price: number;
    save?: string;
    top?: boolean;
    trialDays?: number;
};

const BASE = 38;
const TIERS: Tier[] = [
    { id: "6", label: "6 months", price: 187, save: "Save 18%", top: true, trialDays: 7 },
    { id: "3", label: "3 months", price: 105, save: "Save 8%", trialDays: 7 },
    { id: "1", label: "1 month", price: BASE, trialDays: 7 },
];

export default function SwitchPlanPage() {
    const [params] = useSearchParams();
    const free = params.get("free") === "1"; // /subscription/switch?free=1
    const [sel, setSel] = useState<string>(TIERS[0].id);
    const selectedTier = TIERS.find((t) => t.id === sel) ?? TIERS[0];
    const navigate = useNavigate();

    const subtitle = useMemo(() => {
        return free
            ? "All Features, No Limits — Free to Start"
            : "Save Up to $41 by Switching Plans";
    }, [free]);

    return (
        <PageWrapper className="gap-4">
            <div className="text-center">
                <h1 className="text-[18px] font-[600]">{subtitle}</h1>
                {free ? (
                    <p className="text-[12px] text-light-60 mt-1">
                        Try Premium free for 7 days. Unlock all features and save up to $41
                        when you upgrade to a longer plan.
                    </p>
                ) : (
                    <p className="text-[12px] text-light-60 mt-1">
                        You're already on Premium — now make it smarter. Switch to a longer
                        plan and save up to $41 instantly.
                    </p>
                )}
            </div>

            <RadioGroup
                value={sel}
                onValueChange={setSel}
                className="flex flex-col gap-3"
            >
                {TIERS.map((t) => (
                    <div
                        key={t.id}
                        className="rounded-[12px] border border-light-30 bg-light-10 peer-data-[state=checked]:border-primary-100"
                    >
                        <RadioGroupItem value={t.id} id={`tier-${t.id}`} className="sr-only" />
                        <Label
                            htmlFor={`tier-${t.id}`}
                            className="flex flex-col gap-1 p-4 cursor-pointer w-full"
                        >
                            <div className="flex items-center gap-2">
                <span className="text-[14px] font-[600] text-light-100">
                  {t.label}
                </span>
                                {t.save && (
                                    <span className="text-[10px] px-2 py-[2px] rounded bg-primary-100/20 text-primary-100">
                    {t.save}
                  </span>
                                )}
                                {t.top && (
                                    <span className="text-[10px] px-2 py-[2px] rounded bg-light-20 text-light-60">
                    Top deal
                  </span>
                                )}
                            </div>
                            <div className="text-[12px] text-light-60">
                                {t.id === "1"
                                    ? `$${BASE}/month`
                                    : `$${(t.price / (t.id === "6" ? 6 : 3)).toFixed(1)}/month`}
                                {free ? ". First 7 days free." : ""}
                            </div>
                        </Label>
                    </div>
                ))}
            </RadioGroup>

            <Button
                variant="default"
                className="h-12 bg-violet-accent"
                onClick={() => navigate(`/subscription/checkout/${selectedTier.id}`)}
            >
                Switch Plan
            </Button>
            <Button
                variant="secondary"
                className="h-12 bg-light-20 text-light-100"
                onClick={() => navigate(-1)}
            >
                Maybe later
            </Button>
        </PageWrapper>
    );
}