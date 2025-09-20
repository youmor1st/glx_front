import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserTokens, TokenInfo } from "@/api/tokens-api";

interface UseUserTokensOptions {
  publicAddress: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  fetchOnMount?: boolean; // New prop to control initial fetch
}

interface UseUserTokensReturn {
  tokens: TokenInfo[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
}

export function useUserTokens({
  publicAddress,
  autoRefresh = true,
  refreshInterval = 5000, // 5 seconds by default
  fetchOnMount = true, // Default to true for initial fetch
}: UseUserTokensOptions): UseUserTokensReturn {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userTokens", publicAddress],
    enabled: !!publicAddress && fetchOnMount,
    queryFn: () => getUserTokens(publicAddress),
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const tokens = useMemo(() => data ?? [], [data]);

  return {
    tokens,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
