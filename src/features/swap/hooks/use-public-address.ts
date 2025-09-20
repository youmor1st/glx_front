import { useQuery } from "@tanstack/react-query";
import { BLOCKCHAIN } from "@/shared/constants/blockchain";
import { getPublicWalletByUser } from "@/api/wallets-api";

interface UsePublicAddressReturn {
  publicAddress: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
}

export function usePublicAddress(blockchainSymbol: string = BLOCKCHAIN): UsePublicAddressReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publicAddress", blockchainSymbol],
    queryFn: async (): Promise<string> => {
      const wallets = await getPublicWalletByUser();
      if (!Array.isArray(wallets) || wallets.length === 0) {
        throw new Error("No wallets found");
      }
      const target = String(blockchainSymbol).toUpperCase();
      const wallet = wallets.find((w) => String(w.blockchainSymbol).toUpperCase() === target);
      if (!wallet?.publicKey) {
        throw new Error(`${blockchainSymbol} wallet not found`);
      }
      return wallet.publicKey;
    },
    staleTime: 30_000,
    retry: 1,
  });

  return {
    publicAddress: data ?? "",
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
