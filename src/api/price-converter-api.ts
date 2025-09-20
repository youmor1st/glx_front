import axios from "axios";

export interface ConvertTokensPairRequest {
  isTokenAmount: boolean;
  tokenFrom: string; // mint address of source token
  tokenTo: string;   // mint address of target token
  amount: string;    // if isTokenAmount=true -> token qty; else -> USD amount
}

export interface ConverterLeg {
  tokenAmount: string; // may contain locale comma separator as provided by API
  usdtAmount: string;  // may contain locale comma separator as provided by API
}

export interface ConvertTokensPairResponse {
  from: ConverterLeg;
  to: ConverterLeg;
}

const priceConverterClient = axios.create({
  baseURL: "https://api.owlidar.com/solanapriceconverter/v1/",
  timeout: 15000,
});

/**
 * Converts between two Solana tokens or USD depending on isTokenAmount.
 * - isTokenAmount = true  -> amount is in tokenFrom units
 * - isTokenAmount = false -> amount is in USD
 */
export async function convertTokensPair(
  payload: ConvertTokensPairRequest,
  signal?: AbortSignal
): Promise<ConvertTokensPairResponse> {
  const { data } = await priceConverterClient.post<ConvertTokensPairResponse>(
    "converter/tokens/pair",
    payload,
    { signal }
  );
  return data;
}

/** Utility to safely parse a numeric string that may use comma separators */
export function parseLocaleNumber(value: string): number {
  if (typeof value !== "string") return Number.NaN;
  // Replace comma with dot for decimal part if present; remove thousand separators if any
  const normalized = value.replace(/\s/g, "").replace(/,(?=\d{1,3}(\D|$))/g, ".");
  const parsed = Number(normalized.replace(/(?<=\d)[,.](?=\d{3}(\D|$))/g, ""));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}


