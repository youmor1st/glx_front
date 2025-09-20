import { TopWallet } from '../types';
import { TopWalletCard } from './top-wallet-card';
import { twMerge } from 'tailwind-merge';

interface HotPerformingListProps {
  wallets: TopWallet[];
  className?: string;
  onWalletClick?: (wallet: TopWallet) => void;
}

export function HotPerformingList({ wallets, className, onWalletClick }: HotPerformingListProps) {
  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      {wallets.map((wallet) => (
        <TopWalletCard 
          key={wallet.rank} 
          wallet={wallet} 
          onClick={onWalletClick}
        />
      ))}
    </div>
  );
} 