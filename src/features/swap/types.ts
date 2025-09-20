export interface Token {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  price: number;
  address: string;
  decimal: number;
  imageUrl?: string;
}

export interface TokenBalance {
  amount: number;
  fiat: number;
}

export interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  slippage: number;
}
