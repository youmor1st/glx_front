import NavHeader from "@/features/navigation/components/nav-header";
import { Button } from "@/shared/ui/button";
import { ArrowIcon } from "@/shared/ui/icons";
import PageWrapper from "@/shared/ui/page-wrapper";
import SwitchCard from "@/shared/ui/switch-card";
import { useNavigate } from "react-router-dom";

const ALERTS = [
  { title: "Incoming transfer", description: "When funds are received" },
  { title: "Outgoing transfer", description: "When tokens are sent" },
  { title: "Swap activity", description: "When a token swap occurs" },
  {
    title: "Transaction executed",
    description: "When any transaction is successfully completed",
  },
  {
    title: "Failed or reverted transaction",
    description: "When a transaction fails or is reverted",
  },
  {
    title: "Multiple wallet match",
    description: "When a transaction involves two of your own wallets",
  },
];

export default function NotificationsPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="gap-[28px]">
      <NavHeader
        title="Notifications"
        left={
          <Button onClick={() => navigate("/settings")}>
            <ArrowIcon className="size-6 fill-light-100" />
          </Button>
        }
      />
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[16px] font-[600] text-light-100">
          Wallet Activity Alerts
        </h2>

        {ALERTS.map(({ title, description }) => (
          <SwitchCard key={title} title={title} description={description} />
        ))}
      </div>
    </PageWrapper>
  );
}
