import { useCopyWithState } from "@/shared/hooks/use-copy-with-state";
import { formatAddress } from "@/shared/lib/formatter";
import BlockchainIcon from "@/shared/ui/blockchain-icon";
import { Button } from "@/shared/ui/button";
import { CopyAnimatedIcon } from "@/shared/ui/copy-animated-icon";
import { ChartsIcon, LockIcon, SwapIcon } from "@/shared/ui/icons";
interface WalletInfoCardProps {
  name: string;
  address: string;
  blockchain: BlockchainType;

  tokensHeld: number;
  minTokenValue: number;
  pnl7d: number;
  totalSwaps: number;
}
export default function WalletInfoCard({
  name,
  address,
  blockchain,
  tokensHeld,
  minTokenValue,
  pnl7d,
  totalSwaps,
}: WalletInfoCardProps) {
  const { copied, copy } = useCopyWithState();

  const handleCopy = () => {
    copy(address);
  };

  return (
    <div className="flex flex-col w-full gap-[28px] ">
      <div className="flex w-full gap-[16px]">
        <BlockchainIcon blockchain={blockchain} className="w-[52px]" />
        <div>
          <h3 className="text-[20px] text-light-100 font-bold">{name}</h3>
          <p className="text-[16px] text-light-40 font-medium flex gap-[8px]">
            {formatAddress(address)}
            <Button onClick={handleCopy}>
              <CopyAnimatedIcon copied={copied} className="fill-light-40" />
            </Button>
          </p>
        </div>
      </div>

      <div className="mt-4 text-light-100 text-[12px] space-y-1">
        <div className="flex items-center gap-2">
          <LockIcon className="size-[16px] fill-light-100" />
          Holds {tokensHeld} tokens{" "}
          <span className="text-indicator-green ml-1">{minTokenValue}</span>
        </div>
        <div className="flex items-center gap-2">
          <ChartsIcon className="size-[16px] fill-light-100" />
          P&amp;L (7d):{" "}
          <span className="text-indicator-green ml-1">{pnl7d}</span>
        </div>
        <div className="flex items-center gap-2">
          <SwapIcon className="size-[16px] fill-light-100" />
          Total swaps:{" "}
          <span className="text-indicator-green ml-1">{totalSwaps}</span>
        </div>
      </div>
    </div>
  );
}
