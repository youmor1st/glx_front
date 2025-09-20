interface SavedWallet {
  blockchainSymbol: BlockchainType;
  filterName: string;
  tokens: number;
  each: number;
  pnlForWeek: number;
  growth: number;
  swaps: number;
  address: string;
}

interface SavedToken {
  blockchain: BlockchainType;
  name: string;
  capitalization: number;
  price: number;
  volume: number;
}

type SavedSegmentControlType = "wallets" | "tokens";
