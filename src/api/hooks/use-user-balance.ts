import { useQuery } from "@tanstack/react-query";
import { getBalanceByAddress } from "../balance-api";
import { getPublicWalletByUser, getWalletByAddress } from "../wallets-api";

type BalanceArgs = { blockchain: string; publicAddress: string };

export default function useUserBalance(index = 1) {
  const walletsQ = useQuery({
    queryKey: ["public-wallets"],
    queryFn: getPublicWalletByUser,
    select: (list: Array<{ publicKey: string }>) => ({
      list,
      publicKey: list?.[index]?.publicKey ?? undefined,
    }),
    staleTime: 60_000,
  });

  const publicKey = walletsQ.data?.publicKey;

  const balanceQ = useQuery({
    queryKey: ["balance", publicKey],
    queryFn: () =>
      getBalanceByAddress({
        blockchain: "SOL",
        publicAddress: publicKey as string,
      } as BalanceArgs),
    select: (data) => data.tokenInfo[0].usdAmount,
    enabled: !!publicKey,
    staleTime: 30_000,
    refetchInterval: 5000,
    retry: false,
  });

  const pnlQ = useQuery({
    queryKey: ["pnl", publicKey],
    queryFn: () => getWalletByAddress(publicKey!),
    select: (data) => console.log(data),
    enabled: !!publicKey,
    staleTime: 30_000,
    refetchInterval: 5000,
    retry: false,
  });

  const isLoading = walletsQ.isLoading || (!!publicKey && balanceQ.isLoading);
  const isFetchingAny = walletsQ.isFetching || balanceQ.isFetching;
  const error = balanceQ.error || walletsQ.error;

  return {
    balance: balanceQ.data,
    isLoading,
    isFetchingAny,
    error,
    pnl: pnlQ.data,
  };
}
