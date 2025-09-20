import SavedTokenList from "../saved-token-list";
import TopMarketSelectDrawer from "./top-market-select-drawer";
import TopPriceSelectDrawer from "./top-price-select-drawer";
import TopVolumeSelectDrawer from "./top-volume-select-drawer";

interface SavedTokenViewProps {
  tokens: SavedToken[];
}

export default function SavedTokenView({ tokens }: SavedTokenViewProps) {
  return (
    <>
      <div className="flex gap-[8px] overflow-x-scroll scrollbar-hidden">
        {/* <BlockchainSelectDrawer></BlockchainSelectDrawer> */}
        <TopPriceSelectDrawer></TopPriceSelectDrawer>
        <TopMarketSelectDrawer></TopMarketSelectDrawer>
        <TopVolumeSelectDrawer></TopVolumeSelectDrawer>
      </div>
      <SavedTokenList tokens={tokens}></SavedTokenList>
    </>
  );
}
