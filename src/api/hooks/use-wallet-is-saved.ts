import { useQuery } from "@tanstack/react-query";
import { getSavedWallets } from "../wallets-api";

export const useWalletIsSaved = (walletAddress: string) => {
  const savedWalletsQ = useQuery({
    queryKey: ["saved-wallets"],
    queryFn: getSavedWallets,
  });

  return savedWalletsQ.data?.some(
    (address: SavedWallet) => address.address == walletAddress
  );
};
