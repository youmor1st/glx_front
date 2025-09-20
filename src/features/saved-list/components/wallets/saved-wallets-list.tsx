import { Button } from "@/shared/ui/button";
import { WalletCardFull } from "./wallet-card-full";
import { useNavigate } from "react-router-dom";

interface SavedWalletListProps {
  wallets: SavedWallet[];
  isLoading: boolean;
  isSearching: boolean;
}

export default function SavedWalletList({
  wallets,
  isLoading,
  isSearching,
}: SavedWalletListProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return null;
  }

  if (wallets.length === 0 && !isSearching) {
    return (
      <div className="flex flex-col gap-[8px]">
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
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[8px]">
      {wallets.map((wallet, index) => (
        <WalletCardFull
          wallet={wallet}
          key={"saved_wallet_" + index}
        ></WalletCardFull>
      ))}
    </div>
  );
}
