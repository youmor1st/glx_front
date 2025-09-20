import axios from "axios";
import { BLOCKCHAIN } from "@/shared/constants/blockchain";

// Типы для API токенов
export interface TokenInfo {
  mintAddress: string;
  imageUrl: string;
  tokenName: string;
  tokenAmount: string;
  usdAmount: string;
  decimal: number;
}

// Новые типы для API контрактов
export interface ContractTokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl: string;
}

export interface TokenSearchRequest {
  address?: string;
  name?: string;
}

export interface TokenListRequest {
  page: number;
  size: number;
}

export interface TokenListResponse {
  tokens: ContractTokenInfo[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface TokenInfoRequest {
  blockchain: string;
  public_address: string;
}

export interface TokenInfoResponse {
  tokenInfo: TokenInfo[];
}

// Кеш для картинок токенов
const imageCache = new Map<string, string>();

// Функция для кеширования картинки
const cacheImage = async (url: string): Promise<string> => {
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }

  try {
    // Создаем blob URL для кеширования
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    imageCache.set(url, blobUrl);
    return blobUrl;
  } catch (error) {
    console.error("Failed to cache image:", url, error);
    return url; // Возвращаем оригинальный URL если не удалось кешировать
  }
};

// API клиент для токенов пользователя
const tokensApiClient = axios.create({
  baseURL: "https://api.owlidar.com/accountinfo/v1/",
  timeout: 10000,
});

// API клиент для контрактов (заменяет debugApiClient)
const contractStorageApiClient = axios.create({
  baseURL: "https://api.owlidar.com/contractstorage/v1/",
  timeout: 10000,
});

// Функция для получения токенов пользователя
export async function getUserTokens(publicAddress: string): Promise<TokenInfo[]> {
  if (!publicAddress || typeof publicAddress !== 'string') {
    throw new Error("Invalid public address provided");
  }

  try {
    const requestBody: TokenInfoRequest = {
      blockchain: BLOCKCHAIN.toUpperCase(),
      public_address: publicAddress, // Используем переданный адрес вместо хардкода
    };

    const response = await tokensApiClient.post<TokenInfoResponse>(
      "token/info",
      requestBody
    );

    const tokens = response.data.tokenInfo;

    // Кешируем картинки в фоне (не блокируем отдачу данных)
    (async () => {
      try {
        await Promise.all(
          tokens.slice(0, 30).map(async (token) => {
            if (token.imageUrl) {
              token.imageUrl = await cacheImage(token.imageUrl);
            }
          })
        );
      } catch {}
    })();

    return tokens;
  } catch (error) {
    console.error("Failed to fetch user tokens:", error);
    throw new Error("Failed to fetch user tokens");
  }
}

// Функция для поиска токена по адресу или названию — с поддержкой AbortSignal
export async function searchToken(searchRequest: TokenSearchRequest, signal?: AbortSignal): Promise<ContractTokenInfo[]> {
  try {
    if (!searchRequest.address && !searchRequest.name) {
      throw new Error("Either address or name must be provided");
    }

    const response = await contractStorageApiClient.post<{ tokens: ContractTokenInfo[] }>(
      "contract/storage/search/token",
      searchRequest,
      { signal }
    );

    const tokens = response.data.tokens || [];

    // Кешируем изображения в фоне (до 20 элементов)
    (async () => {
      try {
        await Promise.all(
          tokens.slice(0, 20).map(async (token) => {
            if (token.imageUrl) {
              token.imageUrl = await cacheImage(token.imageUrl);
            }
          })
        );
      } catch {}
    })();

    return tokens;
  } catch (error) {
    // Пробрасываем отмененные запросы без ошибки
    if (axios.isCancel(error) || (error as any)?.name === 'CanceledError') {
      return [];
    }
    console.error("Failed to search token:", error);
    throw new Error("Failed to search token");
  }
}

// Функция для получения списка токенов с пагинацией (для receive field)
export async function getTokenList(listRequest: TokenListRequest, signal?: AbortSignal): Promise<TokenListResponse> {
  try {
    const response = await contractStorageApiClient.post<TokenListResponse>(
      "contract/storage/list",
      listRequest,
      { signal }
    );

    const result = response.data;

    // Кешируем изображения в фоне (до 24 элементов)
    (async () => {
      try {
        await Promise.all(
          result.tokens.slice(0, 24).map(async (token) => {
            if (token.imageUrl) {
              token.imageUrl = await cacheImage(token.imageUrl);
            }
          })
        );
      } catch {}
    })();

    return result;
  } catch (error) {
    if (axios.isCancel(error) || (error as any)?.name === 'CanceledError') {
      throw error;
    }
    console.error("Failed to fetch token list:", error);
    throw new Error("Failed to fetch token list");
  }
}

// Функция для получения debug токенов (для receive field) - теперь использует новый API
export async function getDebugTokens(): Promise<TokenInfo[]> {
  try {
    // Получаем первую страницу токенов (умеренный размер)
    const tokenListResponse = await getTokenList({ page: 1, size: 20 });
    
    // Конвертируем ContractTokenInfo в TokenInfo для совместимости
    const tokens: TokenInfo[] = tokenListResponse.tokens.map(contractToken => ({
      mintAddress: contractToken.address,
      imageUrl: contractToken.imageUrl,
      tokenName: contractToken.name,
      tokenAmount: "0", // У пользователя нет этих токенов
      usdAmount: "0",   // У пользователя нет этих токенов
      decimal: contractToken.decimals,
    }));

    return tokens;
  } catch (error) {
    console.error("Failed to fetch debug tokens:", error);
    throw new Error("Failed to fetch debug tokens");
  }
}

// Функция для очистки кеша картинок (можно вызывать при logout)
export function clearImageCache(): void {
  imageCache.forEach((blobUrl) => {
    URL.revokeObjectURL(blobUrl);
  });
  imageCache.clear();
}
