import PageWrapper from "@/shared/ui/page-wrapper";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";

export default function SubscriptionPage() {
  const navigate = useNavigate();
  // Hardcoded current plan for demo. In real app, fetch from API/store.
  const currentPlan = {
    name: "Premium",
    price: 38,
    nextBilling: "June 31, 2025",
    status: "Active",
  };

  return (
    <PageWrapper className="gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-[600]">Subscription</h1>
      </div>

      <div className="rounded-[16px] p-4 bg-gradient-to-br from-[#5B4BFF] to-[#C03CFF]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[16px] font-[600] text-white">{currentPlan.name}</div>
            <div className="text-[12px] text-white/80">Full access. No limits.</div>
            <div className="text-[12px] text-white/80 mt-2">${currentPlan.price}/month</div>
          </div>
          <span className="text-[12px] px-2 py-1 rounded bg-white/20 text-white">{currentPlan.status}</span>
        </div>
      </div>

      <div className="rounded-[16px] bg-dark-100/50 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-light-60 text-[12px]">Subscription</span>
          <span className="text-light-100 text-[12px]">Until June 30, 2025</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-light-60 text-[12px]">Amount</span>
          <span className="text-light-100 text-[12px]">${currentPlan.price}/month</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-light-60 text-[12px]">Next Billing Date</span>
          <span className="text-light-100 text-[12px]">{currentPlan.nextBilling}</span>
        </div>
      </div>

      <Button className="h-12  bg-light-20 text-light-100" onClick={() => navigate("/subscription/switch")}>Change Plan</Button>
    </PageWrapper>
  );
}