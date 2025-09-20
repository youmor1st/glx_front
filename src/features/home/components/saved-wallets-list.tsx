import { useQuery } from "@tanstack/react-query";
import { getSavedWallets } from "@/api/wallets-api";
import WalletsList from "./wallets-list";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";

type SavedWalletsSectionProps = {
  length?: number;
  onViewAll?: () => void;
};

export default function SavedWalletsSection({
  length = 3,
  onViewAll,
}: SavedWalletsSectionProps) {
  const {
    data: savedWallets,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["saved-wallets"],
    queryFn: getSavedWallets,
  });

  const navigate = useNavigate();

  const toNum = (v: unknown): number =>
    typeof v === "number" ? v : typeof v === "string" ? Number(v) || 0 : 0;

  const normalizedWallets: Wallet[] = (savedWallets ?? []).map(
    (w: any): Wallet => ({
      filterName: w.filterName ?? w.name ?? "Unnamed",
      holdTokensCount: toNum(w.countHoldTokens),
      holdTokensSum: toNum(w.holdTokensSumInDollar),
      totalSwap: toNum(w.totalSwapCount),
      pnl: toNum(w.pnlForWeek),
      realizedProfit: toNum(w.realizedProfitForWeek),
      walletAddress: w.walletAddress ?? w.address ?? "",
      blockchainSymbol: w.blockchainSymbol ?? "SOL",
    })
  );

  const emptyView = (
    <div className="flex flex-col gap-[32px] items-center">
      <div className="flex flex-col w-full items-center">
        <img
          src="EmptySavedList.svg"
          alt="No wallets. Add one!"
          className="w-1/2 h-auto"
        />
        <p className="text-light-100 text-center text-[12px] font-semibold w-[230px]">
          No saved addresses yet. Add wallets and tokens to get started.
        </p>
      </div>

      <Button
        variant="big"
        size="big"
        onClick={() => {
          navigate("/add-address");
        }}
      >
        Add new address
      </Button>
    </div>
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
      listName="Saved lists"
      wallets={normalizedWallets}
      loading={isLoading}
      error={isError}
      length={length}
      onViewAll={onViewAll}
      emptyView={emptyView}
      errorView={errorView}
    />
  );
}
