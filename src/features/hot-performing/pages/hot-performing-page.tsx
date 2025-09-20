import NavHeader from "@/features/navigation/components/nav-header";
import { Button } from "@/shared/ui/button";
import { ArrowIcon, SearchIcon } from "@/shared/ui/icons";
import PageWrapper from "@/shared/ui/page-wrapper";
import SearchBar from "@/shared/ui/search-bar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HotPerformingList } from "../components/hot-performing-list";
import { TopWallet } from "../types";
import BlockchainSelectDrawer from "@/features/saved-list/components/blockchain-select-drawer";
import TopHoldersSelectDrawer from "@/features/saved-list/components/wallets/top-holders-select-drawer";
import PnlSelectDrawer from "@/features/saved-list/components/wallets/pnl-select-drawer";
import TopSwapsSelectDrawer from "@/features/saved-list/components/wallets/top-swaps-select-drawer";
import { twMerge } from "tailwind-merge";

const mockWallets: TopWallet[] = [
  {
    rank: 1,
    blockchain: "eth",
    name: "Name",
    address: "123456...abcdef",
    tokens: 6,
    each: "$1K",
    variant: "top1",
  },
  {
    rank: 2,
    blockchain: "eth",
    name: "Wallet A",
    address: "abcdef...123456",
    pnl: "+$10,450",
    pnlPercent: "+501.7%",
    variant: "top2",
  },
  {
    rank: 3,
    blockchain: "eth",
    name: "Wallet B",
    address: "789abc...def012",
    swaps: 128,
    variant: "top3",
  },
  {
    rank: 4,
    blockchain: "eth",
    name: "Wallet B",
    address: "789abc...def012",
    variant: "default",
  },
  {
    rank: 5,
    blockchain: "eth",
    name: "Wallet C",
    address: "123xyz...ghi456",
    variant: "default",
  },
];

export default function HotPerformingPage() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const handleWalletClick = (wallet: TopWallet) => {
    console.log("Wallet clicked:", wallet);
    navigate(`/wallet-info/${wallet.address}`);
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Здесь можно добавить логику поиска
  };

  return (
    <PageWrapper className="gap-[20px]!">
      <div className="relative">
        <NavHeader
          className={twMerge(showSearch && "border-none")}
          left={
            <Button onClick={() => navigate("/home")}>
              <ArrowIcon className="size-6 fill-light-100" />
            </Button>
          }
          right={
            <Button onClick={() => setShowSearch(true)}>
              <SearchIcon className="size-6 fill-light-100" />
            </Button>
          }
          title="HOT Performing Wallets"
        />
        <SearchBar
          isVisible={showSearch}
          onCross={() => setShowSearch(false)}
          onChange={handleSearch}
          className="w-full absolute right-0 top-1/2 -translate-y-1/2"
        />
      </div>
      <div
        className={twMerge("flex gap-2 mb-2 overflow-x-auto scrollbar-hidden")}
      >
        <BlockchainSelectDrawer onFilterSubmit={() => {}} />
        <TopHoldersSelectDrawer />
        <PnlSelectDrawer />
        <TopSwapsSelectDrawer onFilterSubmit={() => {}} />
      </div>
      <HotPerformingList
        wallets={mockWallets}
        onWalletClick={handleWalletClick}
      />
    </PageWrapper>
  );
}
