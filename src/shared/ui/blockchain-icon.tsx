import { EthereumLogoIcon, SolanaLogoIcon } from "./icons";

interface BlockchainIconProps {
  blockchain: BlockchainType;
  className?: string;
}

export default function BlockchainIcon({
  blockchain,
  className,
}: BlockchainIconProps) {
  return blockchain === "ETH" ? (
    <EthereumLogoIcon className={className} />
  ) : (
    <SolanaLogoIcon className={className} />
  );
}
