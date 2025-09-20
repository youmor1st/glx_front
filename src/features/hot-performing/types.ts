// Тип для топ-кошелька
export interface TopWallet {
  rank: number;
  blockchain: 'eth' | 'sol';
  name: string;
  address: string;
  tokens?: number;
  each?: string;
  pnl?: string;
  pnlPercent?: string;
  swaps?: number;
  variant: 'default' | 'top1' | 'top2' | 'top3';
}

// Тип для фильтров
export type HotPerformingFilterType = 'blockchain' | 'top-holders' | 'pnl' | 'top-swaps'; 