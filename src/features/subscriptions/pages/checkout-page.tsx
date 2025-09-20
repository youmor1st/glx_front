import PageWrapper from "@/shared/ui/page-wrapper";
import { Button } from "@/shared/ui/button";
import { useNavigate, useParams } from "react-router-dom";

const PRICES: Record<string, { label: string; price: number; save?: string }> = {
  "1": { label: "1 Month", price: 38 },
  "3": { label: "3 Months", price: 105, save: "$9 (8%)" },
  "6": { label: "6 Months", price: 187, save: "$41 (18%)" },
};

export default function CheckoutPage() {
  const { duration = "1" } = useParams();
  const d = PRICES[duration] ?? PRICES["1"];
  const navigate = useNavigate();

  return (
    <PageWrapper className="gap-4">
      <h1 className="text-[20px] font-[600]">Checkout</h1>
      <div className="rounded-[16px] bg-dark-100/50 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-light-60">Plan</span>
          <span className="text-light-100">Premium</span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-light-60">Duration</span>
          <span className="text-light-100">{d.label}</span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-light-60">Price</span>
          <span className="text-light-100">${d.price}</span>
        </div>
        {d.save && (
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-light-60">You Save</span>
            <span className="text-light-100">{d.save}</span>
          </div>
        )}
        <div className="h-[1px] bg-light-10 my-1" />
        <div className="flex items-center justify-between text-[14px] font-[600]">
          <span className="text-light-100">Total</span>
          <span className="text-light-100">${d.price}</span>
        </div>
      </div>

      <Button className="h-12 bg-violet-accent" onClick={() => navigate("/subscription")}>Pay</Button>
    </PageWrapper>
  );
}