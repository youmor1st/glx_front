import PageWrapper from "@/shared/ui/page-wrapper";
import { Button } from "@/shared/ui/button";
import { useNavigate, useParams } from "react-router-dom";

const BENEFITS = [
  "Benefit Name",
  "Benefit Name",
  "Benefit Name",
  "Benefit Name",
];

export default function PlanDetailsPage() {
  const { plan = "standard" } = useParams();
  const navigate = useNavigate();

  const title = plan === "premium" ? "Premium" : "Standard";
  const price = plan === "premium" ? "$38/month" : "Free";
  const cta = plan === "premium" ? "Get Premium for $31/m" : "Downgrade to Standard";

  return (
    <PageWrapper className="gap-4">
      <div className="flex items-center justify-between">
        <div className="rounded-[16px] p-4 bg-gradient-to-br from-[#5B4BFF] to-[#C03CFF] w-full">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[16px] font-[600] text-white">{title}</div>
              <div className="text-[12px] text-white/80">{plan === "premium" ? "Full access. No limits." : "Essential tools"}</div>
              <div className="text-[12px] text-white/80 mt-2">{price}</div>
            </div>
            {plan === "premium" && <span className="text-[12px] px-2 py-1 rounded bg-white/20 text-white">Active</span>}
          </div>
        </div>
      </div>

      <div className="rounded-[16px] bg-dark-100/50 p-4 flex flex-col gap-3">
        <h2 className="text-[14px] font-[600]">Benefits</h2>
        <ul className="flex flex-col gap-2">
          {BENEFITS.map((b,i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-light-80">
              <span className="mt-[3px] size-[6px] rounded-full bg-light-40" />
              <div>
                <div className="text-light-100">{b}</div>
                <div className="text-light-40">Description</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {plan === "premium" ? (
        <Button className="h-12 bg-violet-accent" onClick={() => navigate("/subscription/checkout/6")}>{cta}</Button>
      ) : (
        <Button variant="destructive" className="h-12  bg-light-20 text-light-100" onClick={() => navigate("/subscription")}>{cta}</Button>
      )}
    </PageWrapper>
  );
}