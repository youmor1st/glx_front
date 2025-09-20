import { Button } from "@/shared/ui/button";
import { motion } from "framer-motion";
import WalletCard from "./wallet-card";
import SkeletonWalletCard from "./skeleton-wallet-card";

interface Props {
  listName: string;
  description?: string;
  emptyView?: React.ReactNode;
  errorView?: React.ReactNode;
  wallets: Wallet[];
  onViewAll?: () => void;
  glow?: boolean;
  loading: boolean;
  error: boolean;
  length?: number;
}

function WalletsList({
  listName,
  description,
  emptyView,
  errorView,
  wallets,
  onViewAll,
  glow = false,
  length = 3,
  loading,
  error,
}: Props) {
  const renderContent = () => {
    if (loading) {
      return Array.from({ length }).map((_, i) => (
        <SkeletonWalletCard key={i} />
      ));
    }

    if (error) {
      return (
        errorView ?? (
          <div className="text-xs text-red-400">
            Failed to load wallets. Try again.
          </div>
        )
      );
    }

    if (!wallets?.length) {
      return (
        emptyView ?? (
          <div className="text-xs text-light-40">No wallets to show.</div>
        )
      );
    }

    const items = wallets.slice(0, length);
    return items.map((walletCard, i) => (
      <motion.div
        key={`wallet_${walletCard.walletAddress ?? walletCard.address ?? i}`}
        initial={{ opacity: 0, y: 7 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, duration: 0.3, ease: "easeOut" }}
      >
        <WalletCard
          name={walletCard.filterName}
          each={walletCard.holdTokensSum / walletCard.holdTokensCount || 0}
          tokens={walletCard.holdTokensCount}
          pnl={walletCard.pnl}
          swaps={walletCard.totalSwap}
          address={walletCard.walletAddress! || walletCard.address!}
          glow={glow}
          blockchain={"SOL"}
          profit={walletCard.realizedProfit}
        />
      </motion.div>
    ));
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <div className="flex justify-between">
          <h2 className="text-base font-semibold text-light-100">{listName}</h2>
          <Button variant="small" size="small" onClick={onViewAll}>
            View all
          </Button>
        </div>
        {description && (
          <p className="text-xs text-secondary-background/40 font-medium">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-[8px]">{renderContent()}</div>
    </div>
  );
}

export default WalletsList;
