import { Token } from "../types";
import { TokenInfo } from "@/api/tokens-api";

// Функция для конвертации TokenInfo в Token
export const convertTokenInfoToToken = (tokenInfo: TokenInfo): Token => {
  // Рассчитываем цену из API данных, fallback к 1
  let price = 1;
  
  const tokenAmount = parseFloat(tokenInfo.tokenAmount);
  const usdAmount = parseFloat(tokenInfo.usdAmount);
  
  // Если есть реальные данные для расчета цены (tokenAmount > 0)
  if (tokenAmount > 0 && Number.isFinite(tokenAmount) && Number.isFinite(usdAmount)) {
    price = usdAmount / tokenAmount;
  }
  
  return {
    id: tokenInfo.mintAddress,
    name: tokenInfo.tokenName,
    symbol: tokenInfo.tokenName,
    icon: tokenInfo.tokenName.charAt(0).toUpperCase(),
    color: "#9266FF",
    price: Number.isFinite(price) && price > 0 ? price : 1,
    address: tokenInfo.mintAddress,
    decimal: tokenInfo.decimal,
    imageUrl: tokenInfo.imageUrl,
  };
};
