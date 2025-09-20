import { Token } from "../types";

// Fallback converter used only when no backend quote is available.
// Approximates conversion using token decimal ratio; not price-accurate.
export function convertCrypto(
  amount: number,
  fromToken: Token,
  toToken: Token
): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const fromDec = Number(fromToken?.decimal ?? 0);
  const toDec = Number(toToken?.decimal ?? 0);
  if (!Number.isFinite(fromDec) || !Number.isFinite(toDec)) return 0;

  const ratio = toDec / (fromDec || 1);
  if (!Number.isFinite(ratio) || ratio <= 0) return 0;
  return amount * ratio;
}


