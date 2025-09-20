// features/wallets/components/HotWalletsSection.tsx
import { useQuery } from "@tanstack/react-query";
import { getHotWallets } from "@/api/wallets-api";
import WalletsList from "./wallets-list";
import SkeletonWalletCard from "./skeleton-wallet-card";

type HotWalletsSectionProps = {
  length?: number;
  glow?: boolean;
  onViewAll?: () => void;
  description?: string;
};

export default function HotWalletsSection({
  length = 3,
  glow = true,
  onViewAll,
  description = "Last 7 days",
}: HotWalletsSectionProps) {
  const {
    data: hotWallets,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["hot-wallets"],
    queryFn: getHotWallets,
    staleTime: 60_000,
  });

  const normalizedWallets =
    hotWallets?.map((w: any) => ({
      filterName: w.walletName,
      holdTokensCount: w.countHoldTokens,
      holdTokensSum: w.holdTokensSumInDollar,
      totalSwap: w.totalSwapCount,
      pnl: w.pnlForWeek,
      realizedProfit: w.realizedProfitForWeek,
      walletAddress: w.walletAddress,
      blockchainSymbol: w.blockchainSymbol ?? "ETH",
    })) ?? [];

  const emptyView = isError ? (
    <div className="flex flex-col items-center gap-3 text-xs">
      <p className="text-light-100/80">Couldn’t load hot wallets.</p>
      <button
        className="underline text-light-100/60 hover:text-light-100"
        onClick={() => refetch()}
      >
        Try again
      </button>
    </div>
  ) : (
    Array.from({ length }).map((_, i) => <SkeletonWalletCard key={i} />)
  );

  const errorView = (
    <div className="flex flex-col gap-[32px] items-center">
      <div className="flex flex-col w-full items-center">
        <img src="ErrorIllustation.svg" alt="Error" className="w-1/2 h-auto" />

        <p className="text-light-100 text-center text-[12px] font-semibold w-[230px]">
          Something went wrong. Please try later.
        </p>
      </div>
    </div>
  );
  return (
    <WalletsList
      listName="Hot performing"
      description={description}
      wallets={normalizedWallets ?? []}
      loading={isLoading}
      glow={glow}
      length={length}
      onViewAll={onViewAll}
      emptyView={emptyView}
      errorView={errorView}
      error={isError}
    />
  );
}
