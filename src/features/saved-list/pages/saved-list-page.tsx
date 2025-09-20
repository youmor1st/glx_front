import NavHeader from "@/features/navigation/components/nav-header";
import SegmentControl from "@/features/saved-list/components/segment-control";
import { usePlatform } from "@/shared/hooks/use-platform";
import { Button } from "@/shared/ui/button";
import { ArrowIcon, SearchIcon } from "@/shared/ui/icons";
import PageWrapper from "@/shared/ui/page-wrapper";
import SearchBar from "@/shared/ui/search-bar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import SavedTokenView from "../components/tokens/saved-tokens-view";
import SavedWalletView from "../components/wallets/saved-wallets-view";

const mockTockens: SavedToken[] = [
  {
    blockchain: "SOL",
    name: "string",
    capitalization: 123123,
    price: 123123,
    volume: 14,
  },
  {
    blockchain: "ETH",
    name: "string",
    capitalization: 3123,
    price: 35132,
    volume: 134,
  },
];

export default function SavedListPage() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] =
    useState<SavedSegmentControlType>("wallets");
  const { isDesktop } = usePlatform();

  return (
    <PageWrapper
      className={twMerge("gap-[20px]", isDesktop ? "pt-[120px]" : "pt-[180px]")}
    >
      <div
        className={twMerge(
          "sm:max-w-[600px] sm:mx-auto w-full px-[16px] xxs:px-[24px] xs:mx-auto fixed top-0 right-0 left-0 bg-background-0 z-40",
          isDesktop ? "pt-[40px]" : "pt-[100px]"
        )}
      >
        <div className="relative w-full">
          <NavHeader
            className={showSearch ? "border-none" : ""}
            left={
              <Button onClick={() => navigate("/home")}>
                <ArrowIcon className=" size-6 fill-light-100" />
              </Button>
            }
            right={
              <Button onClick={() => setShowSearch(true)}>
                <SearchIcon className="size-6 fill-light-100" />
              </Button>
            }
            title="Saved list"
          />
          <SearchBar
            isVisible={showSearch}
            onCross={() => setShowSearch(false)}
            onChange={(value) => setSearchValue(value)}
            className="absolute top-0 right-0 pb-[16px]"
          ></SearchBar>
        </div>
      </div>
      <SegmentControl
        selectedValue={selectedValue}
        options={[
          { label: "Wallets", value: "wallets" },
          { label: "Tokens", value: "tokens" },
        ]}
        setSelectedValue={(value) =>
          setSelectedValue(value as SavedSegmentControlType)
        }
      />
      {selectedValue === "wallets" ? (
        <SavedWalletView searchValue={searchValue}></SavedWalletView>
      ) : (
        <SavedTokenView tokens={mockTockens}></SavedTokenView>
      )}
    </PageWrapper>
  );
}
