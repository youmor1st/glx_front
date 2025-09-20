import NavHeader from "@/features/navigation/components/nav-header";
import { Button } from "@/shared/ui/button";
import { ArrowIcon, LoadingSpinner } from "@/shared/ui/icons";
import PageWrapper from "@/shared/ui/page-wrapper";
import { useNavigate } from "react-router-dom";
import WalletInfoCard from "../components/wallet-info-card";
import TokensChart from "../components/tokens-chart";
import WalletInfoChart from "../components/wallet-info-chart";
import TokenStats from "../components/token-stats";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWalletByAddress } from "@/api/wallets-api";
import AuthErrorScreen from "@/features/auth/components/auth-error-screen";
import { twMerge } from "tailwind-merge";
import UseKeyboardOpen from "@/shared/hooks/use-keyboard-open";
import { useWalletIsSaved } from "@/api/hooks/use-wallet-is-saved";

export default function WalletInfoPage() {
  const navigate = useNavigate();
  const { walletId: walletAddress } = useParams();

  const { isLoading, isError, data } = useQuery({
    queryKey: [`wallet-${walletAddress}`, walletAddress],
    queryFn: () => getWalletByAddress(walletAddress!),
    enabled: !!walletAddress,
    retry: false,
  });

  const isSaved = useWalletIsSaved(walletAddress!);

  const fallbackText = "Failed to load";
  const isKeyboardOpen = UseKeyboardOpen();

  const stats = data?.walletStatsResponse;
  // const activities = data?.walletActivityResponse?.activities ?? [];
  // const dailyProfit = data?.dailyProfitResponse ?? [];

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner className="size-[36px] animate-spin"></LoadingSpinner>
      </div>
    );

  if (isError) return <AuthErrorScreen />;

  return (
    <PageWrapper className="gap-[36px]">
      <NavHeader
        left={
          <Button onClick={() => navigate("/home")}>
            <ArrowIcon className="size-6 fill-light-100" />
          </Button>
        }
      />

      <WalletInfoCard
        blockchain="SOL"
        tokensHeld={Number(stats?.tokenNum ?? 0)}
        minTokenValue={Number(stats?.totalValue ?? 0)}
        pnl7d={Number(stats?.pnl7d ?? 0)}
        totalSwaps={Number(stats?.buy30d ?? 0) + Number(stats?.sell30d ?? 0)}
        name={stats?.name ?? fallbackText}
        address={walletAddress ?? fallbackText}
      />

      <div className="w-full h-[1px] bg-light-20" />

      <TokensChart />

      <div className="w-full h-[1px] bg-light-20" />

      <TokenStats
        totalPnl={Number(stats?.totalProfit ?? 0)}
        pnlPercentage={Number(stats?.totalProfitPnl ?? 0)}
        transferIn={stats?.buy30d ?? fallbackText}
        transferOut={stats?.sell30d ?? fallbackText}
        avgCost={Number(stats?.tokenAvgCost ?? 0)}
        soldPrice={Number(stats?.tokenSoldAvgProfit ?? 0)}
        position={Number(stats?.totalValue ?? 0)}
        positionCurrent={Number(stats?.unrealizedProfit ?? 0)}
        positionTotal={Number(stats?.realizedProfit ?? 0)}
        totalBuy={Number(stats?.historyBoughtCost ?? 0)}
        totalSell={Number(stats?.totalVolume ?? 0)}
        buyTxns={Number(stats?.buy30d ?? 0)}
        sellTxns={Number(stats?.sell30d ?? 0)}
      />

      <div className="w-full h-[1px] bg-light-20" />

      <WalletInfoChart />

      <div
        className={twMerge(
          "w-full flex justify-center p-[16px] bg-[#1A193266] backdrop-blur-md rounded-t-[20px]  fixed z-50 left-0 right-0",
          isKeyboardOpen
            ? "bottom-0"
            : "bottom-[calc(env(safe-area-inset-bottom)+82px)]"
        )}
      >
        <Button
          type="submit"
          variant="big"
          size="big"
          className={twMerge(
            "sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto",
            isSaved && "bg-light-20"
          )}
        >
          {isSaved ? <>Remove from My List</> : <>Save</>}
        </Button>
      </div>
    </PageWrapper>
  );
}
