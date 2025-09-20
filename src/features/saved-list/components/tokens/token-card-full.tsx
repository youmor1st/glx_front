import { Button } from "../../../../shared/ui/button";
import {
  ArrowRightIcon,
  DiagramIcon,
  DollarIcon,
  EthereumLogoIcon,
  GrowthIcon,
  SolanaLogoIcon,
} from "@/shared/ui/icons";

interface Props {
  token: SavedToken;
}

export function TokenCardFull({ token }: Props) {
  const { blockchain, name, capitalization, price, volume } = token;

  return (
    <div className="flex flex-col bg-background-8 py-[16px] px-[12px] rounded-[16px] gap-[12px]">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-[12px]">
          {blockchain === "ETH" ? (
            <EthereumLogoIcon className="w-[36px]" />
          ) : (
            <SolanaLogoIcon className="w-[36px]" />
          )}
          <h3 className="text-[12px] font-semibold text-light-100">{name}</h3>
        </div>
        <ArrowRightIcon className="ml-2 size-6 flex-shrink-0 fill-secondary-background/40 self-center" />
      </div>
      <div className="w-full h-[1px] bg-light-20"> </div>
      <div className="flex gap-[4px] items-center">
        <Button
          className="border border-light-20 gap-[4px]"
          variant="small"
          size="small"
        >
          <GrowthIcon className="w-[16px] h-[16px] fill-light-100" />$
          {capitalization}
        </Button>
        <Button
          className="border border-light-20 gap-[4px]"
          variant="small"
          size="small"
        >
          <DollarIcon className="w-[16px] h-[16px] fill-light-100" />${price}
        </Button>
        <Button
          className="border border-light-20 gap-[4px]"
          variant="small"
          size="small"
        >
          <DiagramIcon className="w-[16px] h-[16px] fill-light-100" />${volume}{" "}
          (24h)
        </Button>
      </div>
    </div>
  );
}
