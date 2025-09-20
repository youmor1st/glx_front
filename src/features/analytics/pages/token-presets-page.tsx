import NavHeader from "@/features/navigation/components/nav-header";
import { Button } from "@/shared/ui/button";
import { ArrowIcon } from "@/shared/ui/icons";
import PageWrapper from "@/shared/ui/page-wrapper";
import { useNavigate } from "react-router-dom";
import PresetCard from "../components/preset-card";
import { twMerge } from "tailwind-merge";
import UseKeyboardOpen from "@/shared/hooks/use-keyboard-open";

export default function TokenPresetsPage() {
  const navigate = useNavigate();

  const isKeyboardOpen = UseKeyboardOpen();

  return (
    <PageWrapper>
      <NavHeader
        title="Top Token Presets"
        left={
          <Button onClick={() => navigate("/analytics")}>
            <ArrowIcon className="size-6 fill-light-100" />
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3">
        <PresetCard
          icon={<span>👑</span>}
          badge="Safe"
          title="Top Hunters"
          description="Find wallets with the biggest holdings."
        />
        <PresetCard
          icon={<span>📁</span>}
          badge="Fast"
          title="Diversifier"
          description="Mix of large and mid wallets."
        />
        <PresetCard
          icon={<span>📨</span>}
          badge="Fast"
          title="Early Signals"
          description="Spot wallets with early entries."
        />
        <PresetCard
          icon={<span>📊</span>}
          badge="Trusted"
          title="Steady Holders"
          description="Track consistent long-term holders."
        />
      </div>

      <div>
        <div>
          <div className="flex justify-between">
            <h2 className="text-base font-semibold">21313</h2>
            <Button variant="small" size="small">
              View all
            </Button>
          </div>
          <p className="text-xs text-secondary-background/40 font-medium">
            12321313
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <PresetCard
          icon={<span>👑</span>}
          badge="Safe"
          title="Top Hunters"
          description="Find wallets with the biggest holdings."
          onClick={() => navigate("/analytics/token")}
        />
        <PresetCard
          icon={<span>📁</span>}
          badge="Fast"
          title="Diversifier"
          description="Mix of large and mid wallets."
        />
        <PresetCard
          icon={<span>📨</span>}
          badge="Fast"
          title="Early Signals"
          description="Spot wallets with early entries."
        />
        <PresetCard
          icon={<span>📊</span>}
          badge="Trusted"
          title="Steady Holders"
          description="Track consistent long-term holders."
        />
        <PresetCard
          icon={<span>📨</span>}
          badge="Fast"
          title="Early Signals"
          description="Spot wallets with early entries."
        />
        <PresetCard
          icon={<span>📊</span>}
          badge="Trusted"
          title="Steady Holders"
          description="Track consistent long-term holders."
        />
      </div>

      <div
        className={twMerge(
          "w-full flex justify-center p-[16px] bg-[#1A193266] backdrop-blur-md rounded-t-[20px]  fixed z-50 left-0 right-0",
          isKeyboardOpen
            ? "bottom-0"
            : "bottom-[calc(env(safe-area-inset-bottom)+82px)]"
        )}
      >
        <Button type="submit" variant="big" size="big">
          Create New Preset
        </Button>
      </div>
    </PageWrapper>
  );
}
