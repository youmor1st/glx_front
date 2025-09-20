import { useCopyWithState } from "@/shared/hooks/use-copy-with-state";
import { truncateAddress } from "@/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

import {
  CopyIcon,
  EthereumLogoIcon,
  QRIcon,
  SolanaLogoIcon,
  TickIcon,
} from "@/shared/ui/icons";
import { Button } from "@/shared/ui/button";

interface Props {
  name: string;
  address: string;
  blockchain: BlockchainType;
  onClick?: () => void;
}

export const WalletAddressCard = ({
  name,
  address,
  blockchain,
  onClick,
}: Props) => {
  const truncatedAddress = truncateAddress(address);
  const { copied, copy } = useCopyWithState();

  const handleCopy = () => {
    copy(address);
  };

  return (
    <div className="bg-light-20 flex justify-between items-center px-[16px] py-[20px] rounded-[16px] w-full h-[68px]">
      <div className="flex items-center gap-[12px] w-full">
        {blockchain === "ETH" ? (
          <EthereumLogoIcon className="w-[36px]" />
        ) : (
          <SolanaLogoIcon className="w-[36px]" />
        )}
        <div className="flex flex-col ">
          <h4 className="text-light-100 text-[12px] font-semibold">{name}</h4>
          <p className="text-light-40 text-[12px] font-normal">
            {truncatedAddress}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-[8px]">
        <Button
          variant={"ghost"}
          className="bg-light-30 rounded-[8px] p-[8px] ml-[20px] hover:bg-light-40 cursor-pointer"
          onClick={onClick}
        >
          <QRIcon className="fill-light-100 size-5 "></QRIcon>
        </Button>

        <Button
          variant={"ghost"}
          className="bg-light-30 rounded-[8px] p-[8px] flex items-center justify-center hover:bg-light-40 cursor-pointer"
          onClick={handleCopy}
        >
          <AnimatePresence mode="wait" initial={false}>
            {!copied ? (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <CopyIcon className="fill-light-100 size-5" />
              </motion.span>
            ) : (
              <motion.span
                key="tick"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <TickIcon className="fill-light-100 size-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
};
