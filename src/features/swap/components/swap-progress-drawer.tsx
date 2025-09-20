import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { CrossIcon } from "@/shared/ui/icons";
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

interface SwapProgressDrawerProps {
  trigger: React.ReactNode;
  onSwapComplete?: () => void;
  isOpen?: boolean;
  isSwapping?: boolean;
  swapError?: string | null;
  signature?: string;
}

type SwapState = "swapping" | "success" | "error" | "closed";

export function SwapProgressDrawer({
  trigger,
  onSwapComplete,
  isOpen = false,
  isSwapping = false,
  swapError = null,
  signature,
}: SwapProgressDrawerProps) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const [swapState, setSwapState] = useState<SwapState>("closed");

  // Эффект для программного открытия и управления состоянием
  useEffect(() => {
    if (isOpen && !isOpenInternal) {
      setIsOpenInternal(true);
    }
  }, [isOpen, isOpenInternal]);

  // Эффект для управления состоянием свапа
  useEffect(() => {
    if (isOpenInternal) {
      if (isSwapping) {
        setSwapState("swapping");
      } else if (swapError) {
        setSwapState("error");
      } else if (signature) {
        setSwapState("success");
      }
    }
  }, [isOpenInternal, isSwapping, swapError, signature]);

  // Эффект для закрытия при изменении isOpen
  useEffect(() => {
    if (!isOpen && isOpenInternal) {
      setIsOpenInternal(false);
      setSwapState("closed");
    }
  }, [isOpen, isOpenInternal]);

  const handleClose = () => {
    setIsOpenInternal(false);
    setSwapState("closed");
    // Вызываем onSwapComplete при закрытии, если свап был успешным
    if (swapState === "success") {
      onSwapComplete?.();
    }
  };

  const getBackgroundImage = () => {
    switch (swapState) {
      case "swapping":
        return "url('/SwapIllustration.svg')";
      case "success":
        return "url('/SuccessIllustration.svg')";
      case "error":
        return "url('/ErrorIllustration.svg')";
      default:
        return "none";
    }
  };

  const getTitle = () => {
    switch (swapState) {
      case "swapping":
        return "Swapping...";
      case "success":
        return "Done!";
      case "error":
        return "Swap Failed";
      default:
        return "";
    }
  };

  const getDescription = () => {
    switch (swapState) {
      case "swapping":
        return "Tokens will be sent to your wallet once complete.";
      case "success":
        return "Tokens have been added to your wallet.";
      case "error":
        return swapError || "Something went wrong. Please try again.";
      default:
        return "";
    }
  };

  const getButtonText = () => {
    switch (swapState) {
      case "success":
        return "Close";
      case "error":
        return "Try Again";
      default:
        return "";
    }
  };

  const getButtonColor = () => {
    switch (swapState) {
      case "success":
        return "bg-[#9266FF]";
      case "error":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-[#9266FF]";
    }
  };

  return (
    <Drawer
      open={isOpenInternal}
      onOpenChange={setIsOpenInternal}
      modal={false}
    >
      <DrawerTrigger asChild>
        <div>{trigger}</div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="grid justify-items-stretch grid-rows-1 grid-cols-3">
          <div />
          <DrawerTitle className="text-base font-semibold text-light-100 transition-opacity duration-200"></DrawerTitle>
          <DrawerClose className="justify-self-end" asChild>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <CrossIcon className="fill-light-100 size-6" />
            </Button>
          </DrawerClose>
          <DrawerDescription className="sr-only">
            Swap progress
          </DrawerDescription>
        </DrawerHeader>

        <div className="relative w-full h-[80vh] flex flex-col items-center justify-center overflow-hidden mb-[10vh] px-[16px]">
          <div
            className="relative inset-0  w-full h-full flex items-center justify-center transition-opacity duration-300"
            style={{
              backgroundImage: getBackgroundImage(),
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Индикатор загрузки для состояния swapping */}
            {swapState === "swapping" && (
              <div className="w-[80px] h-[80px] rounded-[16px] bg-light-100/10 backdrop-blur-sm flex items-center justify-center animate-pulse">
                <div className="w-[40px] h-[40px] border-2 border-light-100 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Текст */}
          <div className="flex absolute flex-col gap-[8px] text-center mt-[35vh] transition-opacity duration-300">
            <h2 className="text-light-100 font-semibold text-xl">
              {getTitle()}
            </h2>
            <p className="text-light-40 text-[12px]">{getDescription()}</p>
            {signature && swapState === "success" && (
              <p className="text-light-60 text-[10px] mt-2">
                Transaction: {signature.slice(0, 8)}...{signature.slice(-8)}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-center px-[16px]">
          {(swapState === "success" || swapState === "error") && (
            <Button
              onClick={handleClose}
              className={`w-full text-light-100 font-medium ${getButtonColor()} transition-colors duration-200`}
              size="big"
            >
              {getButtonText()}
            </Button>
          )}
        </div>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}
