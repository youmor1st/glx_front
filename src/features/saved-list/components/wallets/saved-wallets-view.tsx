import { getSavedWallets } from "@/api/wallets-api";
import { useQuery } from "@tanstack/react-query";
import { useFilters } from "../../hooks/use-filters";
import BlockchainSelectDrawer from "../blockchain-select-drawer";
import PnlSelectDrawer from "./pnl-select-drawer";
import SavedWalletList from "./saved-wallets-list";
import TopHoldersSelectDrawer from "./top-holders-select-drawer";
import TopSwapsSelectDrawer from "./top-swaps-select-drawer";
import { useState } from "react";

interface SavedWalletViewProps {
  searchValue: string;
}

interface FilterState {
  searchValue?: string;
  blockchain?: BlockchainType;
  pnlValue?: number;
  swapMin?: number;
  swapMax?: number;
}

export default function SavedWalletView({ searchValue }: SavedWalletViewProps) {
  const { data: savedWallets, isPending: isSavedWalletsLoading } = useQuery({
    queryKey: ["saved-wallets"],
    queryFn: () => getSavedWallets(),
  });

  console.log(savedWallets);

  const [filters, setFilters] = useState<FilterState>({});

  const filteredFilters = useFilters({
    wallets: savedWallets,
    ...filters,
  });

  return (
    <>
      <div className="flex gap-[8px] overflow-x-scroll scrollbar-hidden">
        <BlockchainSelectDrawer
          onFilterSubmit={(blockchain: BlockchainType) =>
            setFilters((prev) => ({ ...prev, blockchain }))
          }
        ></BlockchainSelectDrawer>
        <TopHoldersSelectDrawer></TopHoldersSelectDrawer>
        <PnlSelectDrawer></PnlSelectDrawer>

        <TopSwapsSelectDrawer
          onFilterSubmit={({ swapsMax, swapsMin }) =>
            setFilters((prev) => ({ ...prev, swapsMax, swapsMin }))
          }
        ></TopSwapsSelectDrawer>
      </div>
      <SavedWalletList
        isSearching={!!searchValue}
        wallets={filteredFilters ?? []}
        isLoading={isSavedWalletsLoading}
      ></SavedWalletList>
    </>
  );
}
