import { Button } from "@/shared/ui/button";
import PageWrapper from "@/shared/ui/page-wrapper";
import { useNavigate } from "react-router-dom";
import CollapsibleSection from "../components/collapsible-section";

export default function AnalyticsPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <CollapsibleSection title="Top Wallets">
        <p className="text-light-100 text-[12px] font-[500]">
          Use expert-made presets to discover wallets with the biggest impact.
        </p>
        <Button
          variant={"big"}
          size={"big"}
          className="w-full"
          onClick={() => navigate("/analytics/wallet-presets")}
        >
          Discover More
        </Button>
      </CollapsibleSection>
      <CollapsibleSection title="Top Tokens">
        <p className="text-light-100 text-[12px] font-[500]">
          Spot the tokens driving the most movement, attention, and value.
        </p>
        <Button
          variant={"big"}
          size={"big"}
          className="w-full"
          onClick={() => navigate("/analytics/token-presets")}
        >
          Top Tokens
        </Button>
      </CollapsibleSection>
    </PageWrapper>
  );
}
