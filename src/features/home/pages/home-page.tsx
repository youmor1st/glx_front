import ActionBar from "@/features/actions/components/action-bar";
import Balance from "@/features/balance/components/balance";
import Header from "@/shared/ui/header";
import PageWrapper from "@/shared/ui/page-wrapper";
import { useNavigate } from "react-router-dom";
import HotWalletsSection from "../components/hot-wallets-list";
import SavedWalletsSection from "../components/saved-wallets-list";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Header></Header>
      <Balance></Balance>
      <ActionBar></ActionBar>
      <HotWalletsSection
        length={3}
        glow
        description="Last 7 days"
        onViewAll={() => navigate("/hot-performing")}
      />
      <SavedWalletsSection
        length={3}
        onViewAll={() => navigate("/home/saved-list")}
      />
    </PageWrapper>
  );
};
