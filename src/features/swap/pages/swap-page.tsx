// SwapPage.tsx - упрощенная логика с оригинальным интерфейсом
import NavHeader from "@/features/navigation/components/nav-header";
import { Button } from "@/shared/ui/button";
import { Form, FormField } from "@/shared/ui/form";
import { SwapIcon, SettingsIcon, TooltipIcon } from "@/shared/ui/icons";
import PageWrapper from "@/shared/ui/page-wrapper";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import SendField from "../components/swap-card";
import { SwapProgressDrawer } from "../components/swap-progress-drawer";
import SwapSettingsDrawer from "../components/swap-settings";
import { SwapDisclaimer } from "../components/swap-disclaimer";
import { Token } from "../types";
import { usePublicAddress } from "../hooks/use-public-address";
import { useUserTokens } from "../hooks/use-user-tokens";
import { convertTokenInfoToToken } from "../utils/token-utils";
import { signSwap } from "@/api/swaps-api";
import { TokenInfo, getDebugTokens, searchToken } from "@/api/tokens-api";
import { convertTokensPair } from "@/api/price-converter-api";
import { useSearchParams } from "react-router-dom";


const formSchema = z.object({
  send: z.string().min(1, "Please enter an amount to send."),
  receive: z.string().optional(),
});

interface SwapState {
  sendToken: Token;
  receiveToken: Token;
  sendInputMode: "crypto" | "usd";
  receiveInputMode: "crypto" | "usd";
  slippageSettings: {
    autoSlippage: boolean;
    slippagePercent: number;
  };
  showSwapProgress: boolean;
}

export function SwapPage() {
  const { publicAddress } = usePublicAddress();
  const { tokens: userTokens } = useUserTokens({ 
    publicAddress, 
    autoRefresh: false,
    fetchOnMount: !!publicAddress 
  });

  // Временные default токены (будут заменены реальными данными)
  const defaultSendToken: Token = {
    id: "temp-send",
    name: "Loading...",
    symbol: "...",
    icon: "L",
    color: "#9266FF",
    price: 0,
    address: "",
    decimal: 9,
    imageUrl: "",
  };

  const defaultReceiveToken: Token = {
    id: "temp-receive", 
    name: "Loading...",
    symbol: "...",
    icon: "L",
    color: "#9266FF",
    price: 0,
    address: "",
    decimal: 9,
    imageUrl: "",
  };

  const [state, setState] = useState<SwapState>({
    sendToken: defaultSendToken,
    receiveToken: defaultReceiveToken,
    sendInputMode: "crypto",
    receiveInputMode: "crypto",
    slippageSettings: {
      autoSlippage: true,
      slippagePercent: 0.5, // При авто режиме значение 0.5%
    },
    showSwapProgress: false,
  });

  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [receiveTokens, setReceiveTokens] = useState<TokenInfo[]>([]);
  const [quotedReceiveAmount, setQuotedReceiveAmount] = useState<string>("");
  const [priceRate, setPriceRate] = useState<string>("");

  // Parse URL parameters for default form values
  const [searchParams] = useSearchParams();
  const blockchain = searchParams.get("blockchain_symbol");
  const tokenFrom = searchParams.get("token_ticker_from");
  const tokenTo = searchParams.get("token_ticker_to");

  console.log("URL Parameters:", { blockchain, tokenFrom, tokenTo });

  // Функция для поиска токенов по URL параметрам
  const findTokensByParams = async () => {
    if (!tokenFrom && !tokenTo) return;

    try {
      // Поиск send токена
      if (tokenFrom) {
        let sendTokenRequest;
        if (tokenFrom.length >= 32 && /^[A-Za-z0-9]+$/.test(tokenFrom)) {
          // Поиск по адресу
          sendTokenRequest = { address: tokenFrom };
        } else {
          // Поиск по названию
          sendTokenRequest = { name: tokenFrom };
        }

        const foundSendTokens = await searchToken(sendTokenRequest);
        if (foundSendTokens.length > 0) {
          const foundToken = foundSendTokens[0];
          const convertedToken = {
            id: foundToken.address,
            name: foundToken.name,
            symbol: foundToken.symbol,
            icon: foundToken.symbol.charAt(0).toUpperCase(),
            color: "#9266FF",
            price: 0,
            address: foundToken.address,
            decimal: foundToken.decimals,
            imageUrl: foundToken.imageUrl,
          };
          setState(prev => ({ ...prev, sendToken: convertedToken }));
        }
      }

      // Поиск receive токена
      if (tokenTo) {
        let receiveTokenRequest;
        if (tokenTo.length >= 32 && /^[A-Za-z0-9]+$/.test(tokenTo)) {
          // Поиск по адресу
          receiveTokenRequest = { address: tokenTo };
        } else {
          // Поиск по названию
          receiveTokenRequest = { name: tokenTo };
        }

        const foundReceiveTokens = await searchToken(receiveTokenRequest);
        if (foundReceiveTokens.length > 0) {
          const foundToken = foundReceiveTokens[0];
          const convertedToken = {
            id: foundToken.address,
            name: foundToken.name,
            symbol: foundToken.symbol,
            icon: foundToken.symbol.charAt(0).toUpperCase(),
            color: "#9266FF",
            price: 0,
            address: foundToken.address,
            decimal: foundToken.decimals,
            imageUrl: foundToken.imageUrl,
          };
          setState(prev => ({ ...prev, receiveToken: convertedToken }));
        }
      }
    } catch (error) {
      console.error("Failed to find tokens by URL parameters:", error);
    }
  };

  // Обновляем начальный токен для send поля на основе пользовательских токенов
  useEffect(() => {
    if (userTokens.length > 0) {
      // Конвертируем первый токен пользователя в формат Token
      const firstUserToken = userTokens[0];
      const convertedToken = convertTokenInfoToToken(firstUserToken);
      
      setState(prev => ({
        ...prev,
        sendToken: convertedToken
      }));
    }
    }, [userTokens]);

  // Загружаем receive токены через React Query
  const { data: debugTokensData } = useQuery({
    queryKey: ["receiveDebugTokens"],
    queryFn: () => getDebugTokens(),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (debugTokensData && debugTokensData.length) {
      setReceiveTokens(debugTokensData);
      const firstReceiveToken = convertTokenInfoToToken(debugTokensData[0]);
      setState(prev => ({ ...prev, receiveToken: firstReceiveToken }));
    }
  }, [debugTokensData]);

  // Поиск токенов по URL параметрам при загрузке страницы
  useEffect(() => {
    if (tokenFrom || tokenTo) {
      findTokensByParams();
    }
  }, [tokenFrom, tokenTo]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { send: "", receive: "" },
    shouldFocusError: false,
  });

  // Автоматическое обновление receive поля при изменении send
  const sendValue = form.watch("send");
  
  useEffect(() => {
    if (sendValue && parseFloat(sendValue) > 0) {
      // Устанавливаем любое непустое значение для receive поля, чтобы пройти валидацию
      form.setValue("receive", "auto-calculated", { shouldValidate: true });
    } else {
      form.setValue("receive", "", { shouldValidate: true });
    }
  }, [sendValue, form]);

  // Котировка через React Query
  const amountNum = Number(sendValue);
  const isQuoteEnabled = Boolean(
    sendValue && Number.isFinite(amountNum) && amountNum > 0 &&
    state.sendToken.address && state.receiveToken.address
  );

  const { data: quoteData } = useQuery({
    queryKey: [
      "priceQuote",
      state.sendToken.address,
      state.receiveToken.address,
      state.sendInputMode !== "usd" ? "T" : "U",
      sendValue,
    ],
    enabled: isQuoteEnabled,
    queryFn: () => convertTokensPair({
      isTokenAmount: state.sendInputMode !== "usd",
      tokenFrom: state.sendToken.address,
      tokenTo: state.receiveToken.address,
      amount: sendValue!,
    }),
  });

  useEffect(() => {
    if (!quoteData) return;
    const { from, to } = quoteData as any;
    setQuotedReceiveAmount("");
    setPriceRate("");
    const fromToken = Number((from?.tokenAmount || "").toString().replace(/,/g, "."));
    const toToken = Number((to?.tokenAmount || "").toString().replace(/,/g, "."));
    if (Number.isFinite(toToken)) {
      setQuotedReceiveAmount(String(toToken));
    }
    if (Number.isFinite(fromToken) && Number.isFinite(toToken) && fromToken > 0) {
      const rate = toToken / fromToken;
      setPriceRate(rate.toFixed(6));
    }
  }, [quoteData]);

  // Функция свапа с проверкой режима
  const executeSwap = async (amount: string): Promise<void> => {
    // Проверяем режим отправки - API работает только для crypto режима
    if (state.sendInputMode === "usd") {
      setSwapError("USD mode swaps are not available yet. Please switch to crypto mode.");
      return;
    }

    setIsSwapping(true);
    setSwapError(null);
    setSignature(null);

    try {
      const userIdStr = localStorage.getItem("userId");
      const userId = userIdStr ? Number(userIdStr) : undefined;
      
      if (!userId || Number.isNaN(userId)) {
        throw new Error("User ID not found. Please log in again.");
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount to swap.");
      }

      console.log("🚀 Executing Swap - Debug Info:");
      console.log("📤 Send Token:", state.sendToken);
      console.log("📥 Receive Token:", state.receiveToken);
      console.log("💰 Amount:", amount);
      console.log("⚙️ Slippage Settings:", state.slippageSettings);

      const swapPayload = {
        input_coin: {
          address: state.sendToken.address,
          decimal: state.sendToken.decimal,
        },
        output_coin: {
          address: state.receiveToken.address,
          decimal: state.receiveToken.decimal,
        },
        amount,
        auto_slippage: state.slippageSettings.autoSlippage,
        slippage_percentage: !state.slippageSettings.autoSlippage
          ? (state.slippageSettings.slippagePercent / 100).toString()
          : undefined,
        user_id: userId,
      };

      console.log("📦 Swap Payload:", swapPayload);

      const response = await signSwap(swapPayload);

      console.log("✅ Swap Response:", response);

      if (response.signature) {
        setSignature(response.signature);
        setState(prev => ({ ...prev, showSwapProgress: true }));
      } else {
        throw new Error("No signature received from server.");
      }
    } catch (error) {
      console.error("❌ Swap Error:", error);
      setSwapError(error instanceof Error ? error.message : "Swap failed");
    } finally {
      setIsSwapping(false);
    }
  };

  // Функция смены токенов местами
  const handleSwapTokens = () => {
    setState(prev => ({
      ...prev,
      sendToken: prev.receiveToken,
      receiveToken: prev.sendToken,
      sendInputMode: prev.receiveInputMode,
      receiveInputMode: prev.sendInputMode,
    }));
    
    // Меняем значения полей местами
    const sendValue = form.getValues("send");
    const receiveValue = form.getValues("receive");
    form.setValue("send", receiveValue ?? "");
    form.setValue("receive", sendValue ?? "");
  };

  // Функция переключения режима USD/Crypto
  const handleSwapUSD = (fieldName: string) => {
    const isSend = fieldName === "send";
    const currentMode = isSend ? state.sendInputMode : state.receiveInputMode;
    const newMode = currentMode === "crypto" ? "usd" : "crypto";
    
    setState(prev => ({
      ...prev,
      ...(isSend 
        ? { sendInputMode: newMode } 
        : { receiveInputMode: newMode }
      ),
    }));
  };

  // Функция установки токена
  const setToken = (field: "send" | "receive", token: Token) => {
    setState(prev => ({
      ...prev,
      [field === "send" ? "sendToken" : "receiveToken"]: token,
    }));
  };

  // Функция для кнопки Max
  const handleMaxClick = () => {
    // Логика макс кнопки остается в SendField компоненте
  };

  // Поиск tokenInfo для конкретного токена
  const findTokenInfo = (token: Token, isForReceive: boolean = false) => {
    const tokensArray = isForReceive ? receiveTokens : userTokens;
    return tokensArray.find(t => 
      t.mintAddress === token.address || 
      t.tokenName === token.symbol
    );
  };

  const sendTokenInfo = findTokenInfo(state.sendToken, false);
  const receiveTokenInfo = findTokenInfo(state.receiveToken, true);

  // Простые флаги загрузки для скелетонов
  const isSendLoading = !sendTokenInfo;
  const isReceiveLoading = !receiveTokenInfo;

  // Вычисление балансов с учетом режима
  const sendTokenBalance = parseFloat(sendTokenInfo?.tokenAmount || "0");
  const sendUsdBalance = parseFloat(sendTokenInfo?.usdAmount || "0");
  
  // Вычисление текущих значений (sendValue уже определен выше)

  // Проверка баланса в зависимости от режима
  const hasInsufficientBalance = useMemo(() => {
    if (!sendValue || parseFloat(sendValue) <= 0) return false;
    
    const inputAmount = parseFloat(sendValue);
    
    if (state.sendInputMode === "usd") {
      // USD режим: сравниваем с usdAmount (общая стоимость токенов в USD)
      return inputAmount > sendUsdBalance;
    } else {
      // Crypto режим: сравниваем с tokenAmount (количество токенов)
      return inputAmount > sendTokenBalance;
    }
  }, [sendValue, state.sendInputMode, sendTokenBalance, sendUsdBalance]);

      return (
      <PageWrapper className="text-light-100 gap-0  h-full" >
        <NavHeader 
          title="Swap" 
          right={
            <SwapSettingsDrawer
              trigger={
                <Button variant="ghost" size="icon" className="p-0">
                  <SettingsIcon className="size-6 fill-light-100" />
                </Button>
              }
              onConfirm={(settings) => 
                setState(prev => ({ 
                  ...prev, 
                  slippageSettings: {
                    autoSlippage: settings.autoSlippage,
                    slippagePercent: settings.slippagePercent || 0.5
                  }
                }))
              }
            />
          }
        />

        <div className="flex-1 flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => executeSwap(data.send))} className="flex flex-col h-full flex-1">
            <div className="flex-1 ">
              <div className="flex flex-col gap-[12px] py-[16px] relative ">
              {/* Send Field */}
              <FormField
                control={form.control}
                name="send"
                render={({ field, fieldState }) => (
                  <SendField
                    field={field}
                    name="send"
                    tokenLabel="Send"
                    fieldState={fieldState}
                    icon={null}
                    tokenInfo={sendTokenInfo}
                    isUSDMode={state.sendInputMode === "usd"}
                    onSwapUSD={() => handleSwapUSD("send")}
                    selectedToken={state.sendToken}
                    onTokenSelect={(token) => setToken("send", token)}
                    onMaxClick={handleMaxClick}
                    hasError={hasInsufficientBalance}
                    errorMessage={hasInsufficientBalance 
                      ? `Insufficient ${state.sendInputMode === "usd" ? "USD" : state.sendToken.symbol} balance`
                      : undefined
                    }
                    isLoading={isSendLoading}
                  />
                )}
              />

              {/* Swap Button */}
               <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
                 <Button
                   type="button"
                   size="icon"
                   className="size-7 rounded-full bg-violet-accent hover:bg-[#7C4DFF]  border-background shadow-lg"
                   onClick={handleSwapTokens}
                 >
                   <SwapIcon className="size-5 fill-white rotate-90" />
                 </Button>
               </div>

              {/* Receive Field */}
              <FormField
                control={form.control}
                name="receive"
                render={({ field, fieldState }) => (
                  <SendField
                    field={field}
                    name="receive"
                    tokenLabel="Receive"
                    fieldState={fieldState}
                    icon={null}
                    tokenInfo={receiveTokenInfo}
                    isUSDMode={state.receiveInputMode === "usd"}
                    selectedToken={state.receiveToken}
                    onTokenSelect={(token) => setToken("receive", token)}
                    receiveTokens={receiveTokens}
                    sendValue={sendValue}
                    sendToken={state.sendToken}
                    sendTokenInfo={sendTokenInfo}
                    receiveQuotedAmount={quotedReceiveAmount}
                    readOnly
                    isLoading={isReceiveLoading}
                  />
                )}
              />
               </div>

               {/* Price and Slippage Info - показываем только когда есть данные */}
               {sendValue && parseFloat(sendValue) > 0 && (
                 <div className="flex flex-col gap-[12px] bg-light-10 p-[16px] rounded-[16px]">
                   {/* Price Section */}
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-1">
                       <span className="text-[12px] text-light-100">Price</span>
                       <TooltipIcon className="size-4 fill-light-30" />
                     </div>
                     <span className="text-[12px] text-light-60">
                       1 {state.sendToken.symbol} = {priceRate || (() => {
                         const decimalRatio = state.receiveToken.decimal / state.sendToken.decimal;
                         return decimalRatio.toFixed(6);
                       })()} {state.receiveToken.symbol}
                     </span>
                   </div>
                   <div className="h-[1px] bg-light-20"> </div>
                   {/* Slippage Section */}
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-1">
                       <span className="text-[12px] text-light-100">Slippage</span>
                       <TooltipIcon className="size-4 fill-light-30" />
                     </div>
                     <span className="text-[12px] text-light-60">
                       {state.slippageSettings.autoSlippage 
                         ? `${state.slippageSettings.slippagePercent}%` 
                         : `${state.slippageSettings.slippagePercent}%`
                       }
                     </span>
                   </div>
                 </div>
               )}

               {/* Error Display */}
               {swapError && (
                 <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
                   {swapError}
                 </div>
               )}
             </div>
                   {/* Drawers - оригинальные компоненты */}
              <SwapProgressDrawer
                trigger={<></>}
                isOpen={state.showSwapProgress}
                isSwapping={isSwapping}
                swapError={swapError || undefined}
                signature={signature || undefined}
                onSwapComplete={() => {
                  setState(prev => ({ ...prev, showSwapProgress: false }));
                  form.reset();
                }}
              />

              
              <SwapDisclaimer
                trigger={<></>}
                onAgree={() => console.log("User agreed to disclaimer")}
                onCancel={() => console.log("User cancelled disclaimer")}
              />
             {/* Submit Button - приклеена к низу */}
             <div className=" pb-[22px] pt-[34px]">
               <Button
                 type="submit"
                 className="w-full bg-[#9266FF] text-light-100 rounded-[100px] h-[48px]"
                 disabled={isSwapping || !sendValue || hasInsufficientBalance || state.sendInputMode === "usd"}
               >
                 {isSwapping 
                   ? "Swapping..." 
                   : state.sendInputMode === "usd"
                     ? "USD mode not supported"
                     : hasInsufficientBalance 
                       ? `Insufficient ${state.sendToken.symbol} Balance`
                       : "Swap"
                 }
               </Button>
             </div>
            </form>
          </Form>
        </div>


    </PageWrapper>
  );
}

export default SwapPage;