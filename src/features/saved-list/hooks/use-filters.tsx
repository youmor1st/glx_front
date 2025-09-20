import {
  filterByKeyEquals,
  filterByKeyLess,
  filterByKeyMore,
  filterByKeySearch,
} from "@/shared/lib/filtering";

type FilterFn<T> = (items: T[]) => T[];

interface useFilterParams {
  wallets: SavedWallet[];
  searchValue?: string;
  blockchain?: BlockchainType;
  pnlValue?: number;
  swapMin?: number;
  swapMax?: number;
}

export const useFilters = ({
  wallets,
  searchValue,
  blockchain,
  pnlValue,
  swapMin,
  swapMax,
}: useFilterParams) => {
  const filters: FilterFn<SavedWallet>[] = [];

  if (searchValue) {
    filters.push((wallets: SavedWallet[]) =>
      filterByKeySearch<SavedWallet>(wallets, "filterName", searchValue)
    );
  }

  if (blockchain) {
    filters.push((wallets: SavedWallet[]) =>
      filterByKeyEquals<SavedWallet>(wallets, "blockchainSymbol", blockchain)
    );
  }

  if (pnlValue) {
    filters.push((wallets: SavedWallet[]) =>
      filterByKeyEquals<SavedWallet>(wallets, "pnlForWeek", pnlValue)
    );
  }

  if (swapMin) {
    filters.push((wallets: SavedWallet[]) =>
      filterByKeyLess<SavedWallet>(wallets, "swaps", swapMin)
    );
  }

  if (swapMax) {
    filters.push((wallets: SavedWallet[]) =>
      filterByKeyMore<SavedWallet>(wallets, "swaps", swapMax)
    );
  }

  return filters.reduce((acc, fn) => fn(acc), wallets);
};
