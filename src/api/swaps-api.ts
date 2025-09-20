import axios from "axios";

export interface CoinRef {
  address: string;
  decimal: number;
}

export interface SignSwapRequest {
  input_coin: CoinRef;
  output_coin: CoinRef;
  amount: string; // amount as string for backend compatibility (token units)
  auto_slippage: boolean;
  slippage_percentage?: string; // e.g. "0.02" for 2%
  user_id: number;
}

export interface SignSwapResponse {
  signature: string;
}

const swapsClient = axios.create({
  baseURL: "https://api.owlidar.com/swaps/v1/",
  timeout: 15000,
});

export async function signSwap(
  payload: SignSwapRequest,
  options?: { token?: string }
): Promise<SignSwapResponse> {
  // allow explicit token; fallback to localStorage for backward compatibility
  const bearer = options?.token ?? localStorage.getItem("authToken");
  if (!bearer) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const { data } = await swapsClient.post<SignSwapResponse>("swaps/sign", payload, {
    headers: {
      Authorization: `Bearer ${bearer}`,
    },
  });
  return data;
}
