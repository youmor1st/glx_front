import { getPublicWalletByUser } from "@/api/wallets-api";
import ActionButton from "@/features/actions/components/action-button";
import AuthErrorScreen from "@/features/auth/components/auth-error-screen";
import SkeletonWalletCard from "@/features/home/components/skeleton-wallet-card";
import { WalletAddressCard } from "@/features/receive/components/wallet-address-card";
import { useCopyWithState } from "@/shared/hooks/use-copy-with-state";
import { usePlatform } from "@/shared/hooks/use-platform";
import useScrollLock from "@/shared/hooks/use-scroll-lock";
import { useTelegramShareURL } from "@/shared/hooks/use-telegram-utils";
import { truncateAddress } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { CopyAnimatedIcon } from "@/shared/ui/copy-animated-icon";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import DrawerCustomOverlay from "@/shared/ui/drawer-custom-overlay";
import {
  ArrowIcon,
  CrossIcon,
  EthereumLogoIcon,
  QRIcon,
  SolanaLogoIcon,
} from "@/shared/ui/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useWizard, Wizard } from "react-use-wizard";

export function ReceiveDrawer() {
  const [selectedBlockchain, setSelectedBlockchain] =
    useState<BlockchainType | null>(null);

  const [height, setHeight] = useState(300);
  const [isOpen, setIsOpen] = useState(false);
  useScrollLock(isOpen);

  const handleOnOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const {
    data: userPublicWallets,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-wallets"],
    queryFn: getPublicWalletByUser,
  });

  // const location = window.location.href;
  // console.log(location);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleOnOpenChange}
      dismissible
      modal={false}
    >
      <DrawerTrigger asChild>
        {<ActionButton icon={<QRIcon />} label="Receive" />}
      </DrawerTrigger>
      <DrawerCustomOverlay open={isOpen} onClick={() => setIsOpen(false)} />
      <DrawerPortal>
        <DrawerContent>
          <motion.div
            animate={{ height }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <Wizard>
              <Step1
                isLoading={isLoading}
                onSelect={setSelectedBlockchain}
                setHeight={setHeight}
                userPublicWallets={userPublicWallets ?? []}
                isError={isError}
              />
              <Step2
                selectedBlockchain={selectedBlockchain}
                setHeight={setHeight}
                userPublicWallets={userPublicWallets ?? []}
              />
            </Wizard>
          </motion.div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}

const Step1 = ({
  onSelect,
  setHeight,
  userPublicWallets,
  isLoading,
  isError,
}: {
  onSelect: (blockchain: BlockchainType) => void;
  setHeight: (height: number) => void;
  userPublicWallets: any[];
  isLoading: boolean;
  isError: boolean;
}) => {
  const { nextStep } = useWizard();

  const handleClick = (blockchain: BlockchainType) => {
    onSelect(blockchain);
    nextStep();
  };

  const { isDesktop } = usePlatform();

  const queryClient = useQueryClient();
  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ["public-wallets"] });
  };

  useEffect(() => {
    setHeight(300);
  }, [setHeight]);

  useEffect(() => {
    if (isError) setHeight(600);
    else setHeight(300);
  }, [isError]);

  return (
    <div className="h-full flex flex-col ">
      <DrawerHeader className="grid justify-items-stretch grid-rows-1 grid-cols-3">
        <div />
        <DrawerTitle className="text-base font-semibold text-light-100">
          Receive
        </DrawerTitle>
        <DrawerClose className="justify-self-end" asChild>
          <Button variant="ghost" size="icon">
            <CrossIcon className="fill-light-100 size-6!" />
          </Button>
        </DrawerClose>
        <DrawerDescription className="sr-only">
          Select blockchain to receive
        </DrawerDescription>
      </DrawerHeader>
      <div
        className={clsx(
          "flex flex-col gap-[16px] w-full px-6 flex-1 overflow-scroll h-full justify-center pt-[32px] ",
          isDesktop ? "pb-[32px]" : "pb-[48px]"
        )}
      >
        {isLoading ? (
          <>
            <SkeletonWalletCard className="h-[68px] bg-light-20"></SkeletonWalletCard>
            <SkeletonWalletCard className="h-[68px] bg-light-20"></SkeletonWalletCard>
          </>
        ) : isError ? (
          <>
            <AuthErrorScreen></AuthErrorScreen>
            <Button
              variant={"big"}
              size={"big"}
              className="self-center"
              onClick={handleRetry}
            >
              Retry
            </Button>
          </>
        ) : (
          <>
            <WalletAddressCard
              onClick={() =>
                handleClick(userPublicWallets[0]?.blockchainSymbol)
              }
              name={
                userPublicWallets[0]?.blockchainSymbol === "ETH"
                  ? "Ethereum"
                  : "Solana"
              }
              address={userPublicWallets[0]?.publicKey}
              blockchain={userPublicWallets[0]?.blockchainSymbol}
            />
            <WalletAddressCard
              onClick={() =>
                handleClick(userPublicWallets[1]?.blockchainSymbol)
              }
              name={
                userPublicWallets[1]?.blockchainSymbol === "ETH"
                  ? "Ethereum"
                  : "Solana"
              }
              address={userPublicWallets[1]?.publicKey}
              blockchain={userPublicWallets[1]?.blockchainSymbol}
            />
          </>
        )}
      </div>
    </div>
  );
};

const Step2 = ({
  selectedBlockchain,
  setHeight,
  userPublicWallets,
}: {
  selectedBlockchain: BlockchainType | null;
  setHeight: (height: number) => void;
  userPublicWallets: any[];
}) => {
  const { previousStep } = useWizard();
  const { copied, copy } = useCopyWithState();

  useEffect(() => {
    setHeight(644);
  }, [setHeight]);

  if (!selectedBlockchain) return null;

  const selectedWallet = userPublicWallets?.find(
    (w) => w?.blockchainSymbol === selectedBlockchain
  );
  const address: string = selectedWallet?.publicKey ?? "";

  const isEth = selectedBlockchain === "ETH";
  const title = isEth ? "Your Ethereum Address" : "Your Solana Address";
  const networkName = isEth ? "Ethereum" : "Solana";

  const handleCopy = () => {
    if (address) copy(address);
  };

  const { isDesktop } = usePlatform();
  const { shareURL } = useTelegramShareURL();

  return (
    <div className="flex flex-col pb-[48px] h-full">
      <DrawerHeader className="grid justify-items-stretch grid-rows-1 grid-cols-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={previousStep}
          className="justify-self-start"
        >
          <ArrowIcon className="fill-light-100 size-6!" />
        </Button>
        <DrawerTitle className="text-base font-semibold text-light-100" />
        <DrawerClose className="justify-self-end" asChild>
          <Button variant="ghost" size="icon">
            <CrossIcon className="fill-light-100 size-6!" />
          </Button>
        </DrawerClose>
        <DrawerDescription className="sr-only">
          Additional information
        </DrawerDescription>
      </DrawerHeader>

      <div
        className={clsx(
          "flex flex-col gap-[32px] items-center w-full p-6 justify-center",
          isDesktop ? "pt-[32px]" : "pt-[48px]"
        )}
      >
        <div
          className={
            "rounded-[12px] bg-light-100 p-[16px] relative size-[180px]"
          }
        >
          {address && (
            <QRCode
              size={180}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={address}
              viewBox="0 0 180 180"
            />
          )}

          <div
            className={
              "z-5 flex items-center justify-center absolute top-1/2 -translate-1/2 left-1/2 bg-light-100 size-[48px] rounded-[8px] border-[2px] border-black"
            }
          >
            {isEth ? (
              <EthereumLogoIcon
                className={"size-[40px] fill-black"}
              ></EthereumLogoIcon>
            ) : (
              <SolanaLogoIcon
                className={"size-[40px] fill-black"}
              ></SolanaLogoIcon>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[8px] items-center w-[60%]">
          <h2 className="text-light-100 text-base font-semibold text-center">
            {title}
          </h2>
          <p className="text-light-60 text-[12px] font-medium text-center ">
            Use this address to receive tokens and collectibles on
            <span className="text-light-100"> {networkName}.</span>
          </p>
        </div>

        <Button
          variant="big"
          size="big"
          className="bg-light-20"
          onClick={handleCopy}
          disabled={!address}
        >
          <p className="pl-[20px]">{truncateAddress(address || "")}</p>
          <CopyAnimatedIcon copied={copied} />
        </Button>

        <Button
          variant="big"
          size="big"
          disabled={!address}
          onClick={() =>
            shareURL("https://t.me/mybot/myapp", "Look! Some cool app here!")
          }
        >
          Share
        </Button>
      </div>
    </div>
  );
};
