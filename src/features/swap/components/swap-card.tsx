import FilterButton from "@/features/saved-list/components/filter-button";
import { Button } from "@/shared/ui/button";
import { FormControl, FormItem, FormMessage } from "@/shared/ui/form";
import { SwapIcon } from "@/shared/ui/icons";
import React, { useState } from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { Token } from "../types";
import { normalizeInput, validateNumberLength, validateMinValue } from "../utils/number-parser";
import { convertCrypto } from "../utils/crypto-converter";
import { TokenSelector } from "./token-selector";

interface TokenInfo {
  mintAddress: string;
  imageUrl: string;
  tokenName: string;
  tokenAmount: string;
  usdAmount: string;
  decimal: number;
}

interface SendFieldProps {
  field: ControllerRenderProps<any, string>;
  name: string;
  tokenLabel: string;
  fieldState?: { error?: FieldError };
  icon?: React.ReactNode;
  onMaxClick?: () => void;
  selectedToken?: Token;
  onTokenSelect?: (token: Token) => void;
  hasError?: boolean;
  errorMessage?: string;
  onSwapUSD?: (fieldName: "send" | "receive") => void;
  isUSDMode?: boolean;
  readOnly?: boolean;
  tokenInfo?: TokenInfo | TokenInfo[]; // Поддерживаем и объект и массив
  receiveTokens?: TokenInfo[]; // Массив receive токенов для передачи в TokenSelector
  // Props для receive field конверсии
  sendValue?: string; // Значение из send поля для конверсии
  sendToken?: Token; // Токен send поля для конверсии
  sendTokenInfo?: TokenInfo; // TokenInfo send поля для расчетов
  isLoading?: boolean; // Показать skeleton при загрузке
  // Новые пропсы для интеграции котировки
  receiveQuotedAmount?: string; // Котировка количества receive токена (в его токенах, без $)
}

const SendField: React.FC<SendFieldProps> = ({
  field,
  name,
  tokenLabel,
  icon,
  fieldState,
  onMaxClick,
  selectedToken,
  onTokenSelect,
  hasError,
  errorMessage,
  onSwapUSD,
  isUSDMode = false,
  readOnly = false,
  tokenInfo,
  receiveTokens,
  sendValue,
  sendToken,
  sendTokenInfo,
  isLoading = false,
  receiveQuotedAmount,
  ...props
}) => {
  const [isMaxClicked, setIsMaxClicked] = useState(false);
  

  
  // Нормализация tokenInfo - берем первый элемент если это массив
  const normalizedTokenInfo = Array.isArray(tokenInfo) ? tokenInfo[0] : tokenInfo;
  
  // Fallback данные для демонстрации (если tokenInfo не передан)
  const fallbackTokenInfo: TokenInfo = {
    mintAddress: "So11111111111111111111111111111111111111112",
    imageUrl: "https://solana.com/src/img/branding/solanaLogoMark.svg",
    tokenName: "SOL",
    tokenAmount: "1.000000000", // Тестовый баланс
    usdAmount: "200.00", // Тестовая цена
    decimal: 9
  };
  
  // Используем реальные данные или fallback
  const activeTokenInfo = normalizedTokenInfo || fallbackTokenInfo;
  
  const fieldName = name.toLowerCase() as "send" | "receive";
  const hasErrorState = Boolean(fieldState?.error || hasError);
  const tokenName = activeTokenInfo.tokenName || selectedToken?.symbol || 'ETH';
  const balance = activeTokenInfo.tokenAmount || '0';

  // Конвертация значений между USD и crypto
  const convertValue = (inputValue: string, fromUSD: boolean): string => {
    if (!activeTokenInfo || !inputValue || inputValue === '0' || inputValue === '') return '';
    
    const numericInput = parseFloat(inputValue);
    if (isNaN(numericInput) || numericInput <= 0) return '';
    
    const tokenAmount = parseFloat(activeTokenInfo.tokenAmount);
    const usdAmount = parseFloat(activeTokenInfo.usdAmount);
    
    // Проверяем на валидные числа больше нуля
    if (tokenAmount <= 0 || usdAmount <= 0 || !Number.isFinite(tokenAmount) || !Number.isFinite(usdAmount)) {
      return '';
    }
    
    const rate = fromUSD ? tokenAmount / usdAmount : usdAmount / tokenAmount;
    
    if (!Number.isFinite(rate) || rate <= 0) {
      return '';
    }
    
    const converted = numericInput * rate;
    
    if (!Number.isFinite(converted)) {
      return '';
    }
    
    return fromUSD ? converted.toFixed(6) : converted.toFixed(2);
  };

  // Логика отображения значения
  const getDisplayValue = (): string => {
    const inputValue = field.value || '';
    
    // Логика для receive поля - конвертация на основе send поля
    if (fieldName === "receive") {
      // Если нет данных от send поля, показываем 0
      if (!sendValue || !sendToken || !selectedToken || !sendTokenInfo) {
        return isUSDMode ? '$0' : '0';
      }

      const sendAmount = parseFloat(sendValue);
      if (!sendAmount || sendAmount <= 0) {
        return isUSDMode ? '$0' : '0';
      }

      const convertedAmount = convertCrypto(sendAmount, sendToken, selectedToken).toFixed(6);
      // USD/crypto режим влияет только на оформление значения
      return isUSDMode ? `${convertedAmount}` : `$${convertedAmount}`;
    }
    
    // Логика для send поля (как было раньше)
    if (fieldName === "send") {
      // До нажатия Max Button
      if (!isMaxClicked) {
        if (!inputValue || inputValue === '0') {
          return isUSDMode ? '0' : '$0';
        }
        const converted = isUSDMode
          ? convertValue(inputValue, true)
          : convertValue(inputValue, false);
        return isUSDMode ? (converted || '0') : (converted ? `$${converted}` : '$0');
      }
      // После нажатия Max Button
      return isUSDMode
        ? `${activeTokenInfo.tokenAmount} ${tokenName}`
        : `$${activeTokenInfo.usdAmount || '0'}`;
    }
    
      // Fallback для других полей
  return isUSDMode ? `$${inputValue || '0'}` : `${inputValue || '0'} ${tokenName || ''}`;
};

// Функция для получения правильного значения input для receive поля
const getReceiveInputValue = (): string => {
  if (fieldName !== "receive") {
    return field.value || '';
  }
  
  // Если нет данных от send поля, возвращаем 0
  if (!sendValue || !sendToken || !selectedToken || !sendTokenInfo) {
    return '0';
  }
  
  const sendAmount = parseFloat(sendValue);
  if (!sendAmount || sendAmount <= 0) {
    return '0';
  }
  
  // Если пришла котировка с бэка, используем ее в первую очередь
  if (receiveQuotedAmount && Number.isFinite(Number(receiveQuotedAmount))) {
    return Number(receiveQuotedAmount).toFixed(6);
  }

  // Fallback на локальную конвертацию, если котировки нет
  const convertedAmount = convertCrypto(sendAmount, sendToken, selectedToken);
  return convertedAmount.toFixed(6);
};

  const handleMaxClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (fieldName !== "send") {
      onMaxClick?.();
      return;
    }
    
    setIsMaxClicked(true);
    
    const value = isUSDMode ? activeTokenInfo.usdAmount : activeTokenInfo.tokenAmount;
    field.onChange(value);
    
    onMaxClick?.();
  };

  const handleSwapUSD = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Логика только для send поля
    if (fieldName !== "send") {
      return;
    }
    
    const currentDisplayValue = getDisplayValue();
    let newInputValue = '';
    
    // Извлекаем численное значение из DisplayValue
    if (currentDisplayValue && currentDisplayValue !== '$ 0' && currentDisplayValue !== '0') {
      let displayNumericValue = currentDisplayValue;
      
      // Убираем $ префикс если есть
      if (displayNumericValue.startsWith('$')) {
        displayNumericValue = displayNumericValue.substring(1).trim();
      }
      
      // Убираем суффикс токена (например " SOL")
      const spaceIndex = displayNumericValue.indexOf(' ');
      if (spaceIndex > 0) {
        displayNumericValue = displayNumericValue.substring(0, spaceIndex).trim();
      }
      
      // Проверяем что это валидное число
      const numericValue = parseFloat(displayNumericValue);
      if (Number.isFinite(numericValue) && numericValue > 0) {
        newInputValue = displayNumericValue;
      }
    }
    
    // Выполняем переключение
    setIsMaxClicked(false);
    field.onChange(newInputValue);
    onSwapUSD?.(fieldName);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeInput(e.target.value);
    
    if (!validateNumberLength(normalized) || !validateMinValue(normalized)) return;
    
    if (fieldName === "send") {
      setIsMaxClicked(false);
    }
    field.onChange(normalized);
  };


  const tokenButton = onTokenSelect ? (
    isLoading ? (
      <div className="flex items-center gap-[8px] w-[120px] h-[38px] px-[12px] rounded-[12px] bg-light-20 animate-pulse" />
    ) : (
      <TokenSelector
        trigger={
          <FilterButton
            active={false}
            title={selectedToken?.symbol || tokenLabel}
            className="bg-light-20 w-full gap-[6px] px-[15px] transition-all duration-150"
            icon={selectedToken ? (
              selectedToken.imageUrl ? (
                <img 
                  src={selectedToken.imageUrl} 
                  alt={selectedToken.symbol}
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-4 h-4 rounded-full flex items-center justify-center text-light-100 font-bold text-xs"
                  style={{ backgroundColor: selectedToken.color }}
                >
                  {selectedToken.icon}
                </div>
              )
            ) : icon}
          />
        }
        onTokenSelect={onTokenSelect}
        title={name}
        isForReceive={fieldName === "receive"}
        receiveTokens={receiveTokens}
      />
    )
  ) : (
    <FilterButton
      active={false}
      title={tokenLabel}
      className="bg-light-20 w-full gap-[6px]  transition-all duration-150"
      icon={icon}
    />
  );

  const errorDisplay = fieldState?.error ? (
    <FormMessage className="text-[10px]">{fieldState.error?.message}</FormMessage>
  ) : hasError && errorMessage ? (
    <span className="text-[10px] text-indicator-red">{errorMessage}</span>
  ) : null;

  return (
    <FormItem
      className={twMerge(
        "border border-light-10 flex-1 relative bg-light-10 px-[20px] py-[16px] rounded-[16px] gap-0 transition-all duration-150",
        hasErrorState && "border-indicator-red"
      )}
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center h-[16px] mb-[4px]">
        <h2 className="text-light-40 text-[12px] font-medium">{name}</h2>
        <div className="flex flex-col items-end transition-opacity duration-200">{errorDisplay}</div>
      </div>

      {/* Input and Token Selector */}
      <div className="w-full flex justify-between items-center">
        <FormControl>
          <div className="relative w-full">
            {isUSDMode && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[28px] text-light-100 z-10">
                $
              </span>
            )}
           
              <input
                {...field}
                value={fieldName === "receive" ? getReceiveInputValue() : field.value}
                name={name}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                className={`text-[28px] h-[38px] w-full rounded-[8px] text-light-100 placeholder:text-light-40 bg-transparent border-none outline-none ${
                  isUSDMode ? "pl-[20px]" : ""
                } ${readOnly ? "cursor-default" : ""} transition-opacity duration-200`}
                placeholder="0"
                onChange={readOnly ? undefined : handleInputChange}
                readOnly={readOnly}
                {...props}
              />
          </div>
        </FormControl>
        {tokenButton}
      </div>

      {/* Display Value and Balance */}
      <div className="w-full h-[16px] flex justify-between items-center">
        <div className="flex items-center gap-[8px]">
          <h3 className="text-[12px] font-[400] text-light-40 transition-opacity duration-200">
            {isLoading ? (
              <span className="inline-block w-[96px] h-[10px] bg-light-20 rounded-[6px] animate-pulse" />
            ) : (
              getDisplayValue()
            )}
          </h3>
          {onSwapUSD && !isLoading && (
            <button
              type="button"
              className="size-4 rounded-full bg-light-40 flex items-center justify-center hover:bg-light-30 transition-all duration-150"
              onClick={handleSwapUSD}
              title={isUSDMode ? "Switch to crypto" : "Switch to USD"}
            >
              <SwapIcon className="size-2.5 fill-light-100 rotate-90" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-[8px]">
          <h3 className="text-[12px] font-[400] text-light-40">
            {isLoading ? (
              <div className="flex flex-col items-end gap-[6px]">
                <span className="inline-block w-[90px] h-[10px] bg-light-20 rounded-[6px] animate-pulse" />
              </div>
            ) : (
              <>{balance} {tokenName}</>
            )}
          </h3>
          {onMaxClick && !isLoading && (
            <Button
              onClick={handleMaxClick}
              variant="ghost"
              size="sm"
              className="text-[12px] text-[#9266FF] p-0 font-medium hover:bg-light-20 transition-all duration-150"
            >
              Max
            </Button>
          )}
        </div>
      </div>
    </FormItem>
  );
};

export default SendField;