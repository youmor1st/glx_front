import { formatAddress } from "@/shared/lib/formatter";
import { isValidEthAddress, isValidSolAddress } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  ArrowRightIcon,
  ChartsIcon,
  EthereumLogoIcon,
  LockIcon,
  SolanaLogoIcon,
  SwapIcon,
} from "@/shared/ui/icons";
import clsx from "clsx";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  wallet: SavedWallet;
}

export function WalletCardFull({ wallet }: Props) {
  const isValidAddress = (s: string) =>
    isValidEthAddress(s) || isValidSolAddress(s);

  const displayName = useMemo(() => {
    const name = wallet.filterName?.trim();
    if (!name) return formatAddress(wallet.address);
    return isValidAddress(name) ? formatAddress(name) : name;
  }, [wallet.filterName, wallet.address]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/home/wallet-info/${wallet.address}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col bg-background-8 hover:bg-light-16 cursor-pointer py-[16px] px-[12px] rounded-[16px] gap-[12px]"
    >
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-3 flex-1 basis-0 min-w-0 overflow-hidden">
          {wallet.blockchainSymbol === "ETH" ? (
            <EthereumLogoIcon className="w-[36px] shrink-0" />
          ) : (
            <SolanaLogoIcon className="w-[36px] shrink-0" />
          )}
          <h3 className="text-[12px] font-semibold text-light-100  truncate ">
            {displayName}
          </h3>
        </div>
        <ArrowRightIcon className="ml-2 size-6 shrink-0 fill-secondary-background/40 self-center" />
      </div>
      <div className="w-full h-[1px] bg-light-20"> </div>
      <div className="flex gap-[4px] items-center">
        <Button
          className="border border-light-20 gap-[4px]"
          variant="small"
          size="small"
        >
          <LockIcon className="w-[16px] h-[16px] fill-light-100" />$
          {wallet.each} each
        </Button>
        <Button
          className="border border-light-20 gap-[4px]"
          variant="small"
          size="small"
        >
          <ChartsIcon className="w-[16px] h-[16px] fill-light-100" />
          <span
            className={clsx(
              wallet.pnlForWeek > 0
                ? "text-indicator-green"
                : "text-indicator-red"
            )}
          >
            ${wallet.pnlForWeek} (+{wallet.growth}%)
          </span>
        </Button>
        <Button
          className="border border-light-20 gap-[4px]"
          variant="small"
          size="small"
        >
          <SwapIcon className="w-[16px] h-[16px] fill-light-100" />
          {wallet.swaps}
        </Button>
      </div>
    </div>
  );
}
