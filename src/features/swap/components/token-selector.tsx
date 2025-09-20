import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/shared/ui/button";
import { CrossIcon } from "@/shared/ui/icons";
import SearchBar from "@/shared/ui/search-bar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import { Token } from "../types";
import { formatTokenAmount, formatUSD } from "../utils/formatters";
import { useUserTokens } from "../hooks/use-user-tokens";
import { getPublicWalletByUser } from "@/api/wallets-api";
import { TokenInfo, getDebugTokens, searchToken, getTokenList, ContractTokenInfo } from "@/api/tokens-api";

interface TokenSelectorProps {
  trigger: React.ReactNode;
  onTokenSelect: (token: Token) => void;
  title?: string;
  isForReceive?: boolean; // true для receive field, false для send field
  receiveTokens?: TokenInfo[]; // Внешние receive токены (передаются из swap-page)
}

interface TokenItemProps {
  token: Token;
  balance: { amount: number; fiat: number } | undefined;
  onSelect: (token: Token) => void;
  isUserToken?: boolean;
  showFiatValue?: boolean; // Проп для контроля отображения fiatValue
}

const TokenItem = React.memo<TokenItemProps>(({ token, balance, onSelect, isUserToken = false, showFiatValue = true }) => {
  const balanceText =
    !balance || balance.amount <= 0
      ? `0 ${token.symbol}`
      : `${formatTokenAmount(balance.amount)} ${token.symbol}`;

  const fiatValue = formatUSD(balance?.fiat ?? 0);

  return (
    <div
      onClick={() => onSelect(token)}
      className={`flex items-center gap-[8px] p-[12px] rounded-[12px] bg-[#1F1E3B] hover:bg-light-20 cursor-pointer transition-colors ${
        isUserToken ? 'border-l-2 border-[#9266FF]' : ''
      } transition-opacity duration-200`}
    >
      {/* Inline token icon */}
      {token.imageUrl ? (
        <img 
          src={token.imageUrl} 
          alt={token.symbol}
          className="w-9 h-9 rounded-full object-cover"
        />
      ) : (
        <div 
          className="w-9 h-9 rounded-full flex items-center justify-center text-light-100 font-bold"
          style={{ backgroundColor: token.color, fontSize: '21.6px' }}
        >
          {token.icon}
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-[12px] font-semibold text-[#F4F4FF] truncate">
          {token.name}
        </span>
        <span className="text-[12px] font-medium text-[#5A5984] truncate">
          {balanceText}
        </span>
      </div>
      <div className="ml-auto text-right">
        {/* Показываем fiatValue только если showFiatValue = true */}
        {showFiatValue && (
          <>
            <div className="text-[12px] font-semibold text-[#F4F4FF]">
              {fiatValue}
            </div>
            <div className="text-[12px] font-medium text-[#5A5984]">
              {fiatValue}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

// Simple skeleton block
const SkeletonRow: React.FC = () => (
  <div className="flex items-center gap-[8px] p-[12px] rounded-[12px] bg-[#1F1E3B] animate-pulse">
    <div className="w-9 h-9 rounded-full bg-light-20" />
    <div className="flex-1 min-w-0">
      <div className="h-[12px] w-1/3 bg-light-20 rounded mb-[6px]" />
      <div className="h-[12px] w-1/4 bg-light-20 rounded" />
    </div>
    <div className="w-[60px] h-[12px] bg-light-20 rounded" />
  </div>
);

// Функция для конвертации TokenInfo в Token
const convertTokenInfoToToken = (tokenInfo: TokenInfo): Token => {
  const tokenAmount = parseFloat(tokenInfo.tokenAmount);
  const usdAmount = parseFloat(tokenInfo.usdAmount);
  
  // Безопасное вычисление цены
  let price = 0;
  if (tokenAmount > 0 && Number.isFinite(tokenAmount) && Number.isFinite(usdAmount)) {
    price = usdAmount / tokenAmount;
  } else if (Number.isFinite(usdAmount)) {
    // Если tokenAmount = 0, используем usdAmount как примерную цену
    price = usdAmount;
  }
  
  return {
    id: tokenInfo.mintAddress,
    name: tokenInfo.tokenName,
    symbol: tokenInfo.tokenName,
    icon: tokenInfo.tokenName.charAt(0).toUpperCase(),
    color: "#9266FF", // дефолтный цвет
    price: Number.isFinite(price) && price > 0 ? price : 0,
    address: tokenInfo.mintAddress,
    decimal: tokenInfo.decimal,
    imageUrl: tokenInfo.imageUrl,
  };
};

// Функция для конвертации ContractTokenInfo в Token
const convertContractTokenToToken = (contractToken: ContractTokenInfo): Token => {
  return {
    id: contractToken.address,
    name: contractToken.name,
    symbol: contractToken.symbol,
    icon: contractToken.symbol.charAt(0).toUpperCase(),
    color: "#9266FF", // дефолтный цвет
    price: 0, // Цена неизвестна для контрактных токенов
    address: contractToken.address,
    decimal: contractToken.decimals,
    imageUrl: contractToken.imageUrl,
  };
};

// Функция для создания баланса из TokenInfo
const createBalanceFromTokenInfo = (tokenInfo: TokenInfo) => {
  return {
    amount: parseFloat(tokenInfo.tokenAmount),
    fiat: parseFloat(tokenInfo.usdAmount),
  };
};

export function TokenSelector({
  trigger,
  onTokenSelect,
  title,
  isForReceive = false,
  receiveTokens: externalReceiveTokens,
}: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [publicAddress, setPublicAddress] = useState<string>("");
  const [receiveTokens, setReceiveTokens] = useState<TokenInfo[]>([]);
  const [isLoadingReceive, setIsLoadingReceive] = useState(false);
  const [receiveError, setReceiveError] = useState<string | null>(null);
  
  // Новые состояния для поиска и пагинации
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchDebounceRef = useRef<number | null>(null);
  const lastSearchedRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const searchCacheRef = useRef<Map<string, Token[]>>(new Map());

  // Получаем публичный адрес пользователя (SOL)
  useEffect(() => {
    const fetchPublicAddress = async () => {
      try {
        const wallets: Array<{ publicKey: string; blockchainSymbol: string }> = await getPublicWalletByUser();
        if (Array.isArray(wallets) && wallets.length > 0) {
          const solWallet = wallets.find(w => w.blockchainSymbol === "SOL");
          if (solWallet?.publicKey) {
            setPublicAddress(solWallet.publicKey);
          }
        }
      } catch (error) {
        // Fallback: не показываем токены если нет публичного адреса
      }
    };

    if (isOpen && !isForReceive) {
      fetchPublicAddress();
    }
  }, [isOpen, isForReceive]);

  // Функция для загрузки debug токенов для receive field
  const fetchReceiveTokens = async () => {
    if (!isForReceive) return;
    
    setIsLoadingReceive(true);
    setReceiveError(null);
    
    try {
      const debugTokens = await getDebugTokens();
      setReceiveTokens(debugTokens);
    } catch (error) {
      console.error("Failed to fetch receive tokens:", error);
      setReceiveError("Failed to load tokens");
      setReceiveTokens([]); // Fallback to empty array
    } finally {
      setIsLoadingReceive(false);
    }
  };

  // Новая функция для поиска токенов
  const handleSearch = async (query: string) => {
    const trimmed = query.trim();

    const isAddressLike = trimmed.length >= 32 && /^[A-Za-z0-9]+$/.test(trimmed);
    if (!isAddressLike && trimmed.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      lastSearchedRef.current = "";
      return;
    }

    if (lastSearchedRef.current === trimmed) return;
    lastSearchedRef.current = trimmed;

    // Serve from cache if available
    if (searchCacheRef.current.has(trimmed)) {
      setSearchResults(searchCacheRef.current.get(trimmed)!);
      return;
    }

    // Cancel previous in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setIsSearching(true);
    setSearchError(null);

    try {
      let searchRequest;
      if (isAddressLike) {
        searchRequest = { address: trimmed };
      } else {
        searchRequest = { name: trimmed };
      }

      const foundTokens = await searchToken(searchRequest, abortRef.current.signal);
      const convertedTokens = foundTokens.map(convertContractTokenToToken);

      // Cache results
      searchCacheRef.current.set(trimmed, convertedTokens);
      setSearchResults(convertedTokens);
    } catch (error: any) {
      if (error?.name === 'CanceledError' || error?.message === 'canceled') {
        // silently ignore
      } else {
        console.error("Search failed:", error);
        setSearchError("Search failed. Please try again.");
        setSearchResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced input handler
  const handleSearchInput = (query: string) => {
    setSearchQuery(query);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = window.setTimeout(() => {
      handleSearch(query);
    }, 350);
  };

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  // Новая функция для загрузки следующей страницы токенов
  const loadMoreTokens = async () => {
    if (currentPage >= totalPages || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getTokenList({ page: nextPage, size: 20 });
      
      // Конвертируем ContractTokenInfo в TokenInfo для совместимости
      const newTokenInfos: TokenInfo[] = response.tokens.map(contractToken => ({
        mintAddress: contractToken.address,
        imageUrl: contractToken.imageUrl,
        tokenName: contractToken.name,
        tokenAmount: "0", // У пользователя нет этих токенов
        usdAmount: "0",   // У пользователя нет этих токенов
        decimal: contractToken.decimals,
      }));
      
      setReceiveTokens(prev => [...prev, ...newTokenInfos]);
      setCurrentPage(nextPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load more tokens:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Получаем токены пользователя только для send field
  const { tokens: userTokens, isLoading: isLoadingUserTokens, error: userTokensError, refetch } = useUserTokens({
    publicAddress,
    autoRefresh: isOpen && !isForReceive, // Автообновление только когда открыт селектор для send
    refreshInterval: 5000,
    fetchOnMount: isOpen && !isForReceive, // Первичная загрузка только при открытии
  });

  // memoize to avoid re-renders
  const userTokensAsTokens: Token[] = useMemo(() => userTokens.map(convertTokenInfoToToken), [userTokens]);
  const userTokenBalances = useMemo(() => {
    const map: Record<string, { amount: number; fiat: number }> = {};
    userTokens.forEach((t) => {
      map[t.mintAddress] = createBalanceFromTokenInfo(t);
    });
    return map;
  }, [userTokens]);

  const actualReceiveTokens = externalReceiveTokens || receiveTokens;
  const receiveTokensAsTokens: Token[] = useMemo(() => actualReceiveTokens.map(convertTokenInfoToToken), [actualReceiveTokens]);
  const receiveTokenBalances = useMemo(() => {
    const map: Record<string, { amount: number; fiat: number }> = {};
    actualReceiveTokens.forEach((t) => {
      map[t.mintAddress] = createBalanceFromTokenInfo(t);
    });
    return map;
  }, [actualReceiveTokens]);

  // Выбираем токены для отображения
  const availableTokens = isForReceive 
    ? (searchQuery.trim() ? searchResults : receiveTokensAsTokens) // Поиск или список токенов
    : userTokensAsTokens; // Только пользовательские токены для send
  const availableBalances = isForReceive 
    ? receiveTokenBalances 
    : userTokenBalances;

  // Фильтрация токенов (теперь не нужна, так как поиск происходит на сервере)
  const filteredTokens = availableTokens;

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    setIsOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchCross = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !isForReceive) {
      // Триггерим запрос при каждом открытии для send field
      refetch();
    }
    if (open && isForReceive) {
      // Триггерим debug запрос при каждом открытии для receive field
      fetchReceiveTokens();
      setCurrentPage(1);
    }
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
      setSearchError(null);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="grid justify-items-stretch grid-rows-1 grid-cols-3">
          <div />
          <DrawerTitle className="text-base font-semibold text-light-100">
            {title || "Select Token"}
          </DrawerTitle>
          <DrawerClose className="justify-self-end" asChild>
            <Button variant="ghost" size="icon">
              <CrossIcon className="fill-light-100 size-6" />
            </Button>
          </DrawerClose>
          <DrawerDescription className="sr-only">
            Select cryptocurrency
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-[16px] p-[16px]">
          <SearchBar
            className="w-full pt-[7px] pb-[7px]"
            isVisible={true}
            onCross={handleSearchCross}
            placeholder="Search tokens"
            onChange={handleSearchInput}
            autoFocus={true}
          />

          <div className="flex flex-col gap-[8px] max-h-[400px] overflow-y-auto">
            {/* Skeletons */}
            {(!isForReceive && isLoadingUserTokens) && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {(isForReceive && (isLoadingReceive && !searchQuery.trim())) && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {isSearching && (
              <>
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {/* Error states (unchanged) */}
            {!isForReceive && userTokensError && (
              <div className="flex flex-col items-center justify-center py-[16px] text-center transition-opacity duration-200">
                <div className="text-red-400 text-[14px] font-medium mb-[8px]">
                  Failed to load your tokens
                </div>
                <div className="text-light-60 text-[12px]">
                  Showing available tokens only
                </div>
              </div>
            )}

            {isForReceive && receiveError && !searchQuery.trim() && (
              <div className="flex flex-col items-center justify-center py-[16px] text-center transition-opacity duration-200">
                <div className="text-red-400 text-[14px] font-medium mb-[8px]">
                  Failed to load receive tokens
                </div>
                <div className="text-light-60 text-[12px]">
                  Please try again later
                </div>
              </div>
            )}

            {searchError && (
              <div className="flex flex-col items-center justify-center py-[16px] text-center transition-opacity duration-200">
                <div className="text-red-400 text-[14px] font-medium mb-[8px]">
                  {searchError}
                </div>
                <div className="text-light-60 text-[12px]">
                  Try searching with different terms
                </div>
              </div>
            )}

            {/* Token list */}
            {filteredTokens.length > 0 && !isSearching ? (
              <>
                {filteredTokens.map((token: Token) => (
                  <TokenItem
                    key={token.id}
                    token={token}
                    balance={availableBalances[token.id]}
                    onSelect={handleTokenSelect}
                    isUserToken={!isForReceive && userTokensAsTokens.some(t => t.id === token.id)}
                    showFiatValue={!isForReceive}
                  />
                ))}
                {isForReceive && !searchQuery.trim() && currentPage < totalPages && (
                  <div className="flex justify-center pt-[16px]">
                    <Button
                      onClick={loadMoreTokens}
                      disabled={isLoadingMore}
                      variant="ghost"
                      className="text-light-60 hover:text-light-100"
                    >
                      {isLoadingMore ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )}
              </>
            ) : null}

            {/* Empty state */}
            {filteredTokens.length === 0 && !isSearching && !isLoadingUserTokens && !(isForReceive && isLoadingReceive) && (
              <div className="flex flex-col items-center justify-center py-[32px] text-center transition-opacity duration-200">
                <div className="text-light-40 text-[14px] font-medium mb-[8px]">
                  {searchQuery.trim()
                    ? "No tokens found"
                    : isForReceive && actualReceiveTokens.length === 0
                    ? "No receive tokens available"
                    : !isForReceive && userTokens.length === 0
                    ? "No tokens in your wallet"
                    : "No tokens available"}
                </div>
                <div className="text-light-60 text-[12px]">
                  {searchQuery.trim()
                    ? "Try searching with different terms"
                    : isForReceive && actualReceiveTokens.length === 0
                    ? "Please refresh or try again later"
                    : !isForReceive && userTokens.length === 0
                    ? "Add some tokens to your wallet to start swapping"
                    : ""}
                </div>
              </div>
            )}
          </div>
        </div>

        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}
