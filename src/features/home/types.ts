interface Wallet {
  filterName: string;
  blockchainSymbol: BlockchainType;
  holdTokensCount: number;
  holdTokensSum: number;
  totalSwap: number;
  pnl: number;
  walletAddress?: string;
  address?: string;
  realizedProfit: number;
}

type BlockchainType = "ETH" | "SOL";
