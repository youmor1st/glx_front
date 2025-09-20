// swap-settings.tsx — замени существующий файл
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { CrossIcon } from "@/shared/ui/icons";
import { Switch } from "@/shared/ui/switch";
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

interface SwapSettingsDrawerProps {
  trigger: React.ReactNode;
  onConfirm?: (settings: {
    autoSlippage: boolean;
    slippagePercent?: number;
  }) => void;
}

type PresetOption = "0.5" | "1" | "2" | "custom";

const PRESET_OPTIONS: PresetOption[] = ["0.5", "1", "2", "custom"];

export function SwapSettingsDrawer({
  trigger,
  onConfirm,
}: SwapSettingsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [autoSlippage, setAutoSlippage] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<PresetOption>("0.5");
  const [customValue, setCustomValue] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const slippageNumber = autoSlippage
    ? undefined
    : selectedPreset === "custom"
    ? (() => {
        const parsed = Number(customValue.replace(",", "."));
        return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
      })()
    : Number(selectedPreset);

  const hasError =
    !autoSlippage && selectedPreset === "custom" && (slippageNumber ?? 0) > 30;
  const showWarning = !autoSlippage && !hasError && (slippageNumber ?? 0) >= 3;

  useEffect(() => {
    if (showCustomInput && inputRef.current) {
      // autofocus and open numeric keyboard on mobile
      inputRef.current.focus();
    }
  }, [showCustomInput]);

  const handleConfirm = () => {
    if (!autoSlippage) {
      if (!slippageNumber || slippageNumber <= 0 || slippageNumber > 30) {
        // invalid - do nothing
        return;
      }
    }
    onConfirm?.({ autoSlippage, slippagePercent: slippageNumber });
    setIsOpen(false);
  };

  const handleAutoSlippageChange = (value: boolean) => {
    setAutoSlippage(value);
  };

  const handlePresetSelect = (option: PresetOption) => {
    setSelectedPreset(option);
    setShowCustomInput(option === "custom");
    if (option !== "custom") {
      setCustomValue("");
    }
  };

  // sanitize custom input: allow only numbers and one dot, max 2 decimals, no crazy leading zeros
  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/,/g, ".");
    v = v.replace(/[^0-9.]/g, "");
    // keep only first dot
    const firstDot = v.indexOf(".");
    if (firstDot >= 0) {
      const before = v.slice(0, firstDot);
      let after = v.slice(firstDot + 1).replace(/\./g, "");
      after = after.slice(0, 2); // limit to 2 decimals for slippage
      v = before + "." + after;
    }
    // strip leading zeros except "0.x"
    if (v.length > 1 && v[0] === "0" && v[1] !== ".") {
      v = v.replace(/^0+/, "");
      if (v === "") v = "0";
    }
    // cut length
    if (v.length > 6) v = v.slice(0, 6);
    setCustomValue(v);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // reset local custom state when closing if needed
    }
  };

  const isConfirmDisabled = !autoSlippage && (!slippageNumber || slippageNumber <= 0 || slippageNumber > 30);

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="grid justify-items-stretch grid-rows-1 grid-cols-3">
          <div />
          <DrawerTitle className="text-base  font-semibold text-light-100">
            Swap Settings
          </DrawerTitle>
          <DrawerClose className="justify-self-end" asChild>
            <Button variant="ghost" size="icon">
              <CrossIcon className="fill-light-100 size-6" />
            </Button>
          </DrawerClose>
          <DrawerDescription className="sr-only">
            Configure swap settings
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-[20px] pt-[12px] min-h-[246px]">
          <div className="flex flex-col gap-[8px]">
            <h3 className="text-light-100 text-[16px] font-semibold">
              Slippage
            </h3>
            <div className="flex items-center justify-between rounded-[8px] bg-[#282845] px-[12px] py-[12px] transition-all duration-150">
              <span className="text-light-100 text-[12px] font-medium">
                Auto
              </span>
              <Switch
                checked={autoSlippage}
                onCheckedChange={handleAutoSlippageChange}
              />
            </div>
            <p className="text-xs text-light-40">
              OwLidar automatically searches for the minimal slippage to ensure
              your swap goes through.
            </p>
          </div>

          {!autoSlippage && (
            <div className="flex flex-col gap-[10px]">
              <div className="grid grid-cols-4 bg-light-20 rounded-[8px] gap-[8px] p-[4px]">
                {PRESET_OPTIONS.map((option) => {
                  const isActive = selectedPreset === option;

                  if (option !== "custom") {
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handlePresetSelect(option)}
                        className={`${
                          isActive
                            ? "bg-light-30 text-light-100"
                            : "bg-transparent text-light-40"
                        } h-[40px] rounded-[8px] text-xs font-medium transition-all duration-150`}
                      >
                        {`${option}%`}
                      </button>
                    );
                  }

                  return (
                    <div
                      key="custom"
                      className={`${
                        isActive ? "bg-light-30" : "bg-transparent"
                      } h-[40px] rounded-[8px] text-xs font-medium transition-all duration-150 flex items-center justify-center px-[8px] ${
                        hasError ? "border border-indicator-red" : ""
                      }`}
                      onClick={() => handlePresetSelect("custom")}
                    >
                      {isActive && showCustomInput ? (
                        <input
                          ref={inputRef}
                          value={customValue}
                          onChange={handleCustomValueChange}
                          placeholder="0.00"
                          inputMode="decimal"
                          className={`w-full text-center bg-transparent outline-none placeholder:text-light-40 ${
                            isActive ? "text-light-100" : "text-light-40"
                          }`}
                          aria-label="Custom slippage"
                          autoFocus
                        />
                      ) : (
                        <button
                          type="button"
                          className={`${
                            isActive ? "text-light-100" : "text-light-40"
                          }`}
                        >
                          Custom
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-light-40">
                If the price shifts beyond the set slippage, the transaction
                won't complete. Setting it too high may lead to a poor trade
                outcome.
              </p>

              {hasError && (
                <p className="text-xs text-indicator-red">
                  Value must be under 30%.
                </p>
              )}
              {showWarning && !hasError && (
                <p className="text-xs text-[#FFD54D] flex items-center gap-1">
                  Your trade could be frontrun, leading to a worse outcome.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center pt-[52px] pb-[14px]">
          <Button
            onClick={handleConfirm}
            className={`w-full bg-violet-accent py-[13px] text-light-100 text-base font-semibold ${isConfirmDisabled ? "opacity-50 pointer-events-none" : ""}`}
            size="big"
            disabled={isConfirmDisabled}
          >
            Confirm
          </Button>
        </div>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}

export default SwapSettingsDrawer;
