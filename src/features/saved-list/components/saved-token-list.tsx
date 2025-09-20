import { TokenCardFull } from "./tokens/token-card-full";

interface SavedTokntListProps {
  tokens: SavedToken[];
}

export default function SavedTokenList({ tokens }: SavedTokntListProps) {
  return (
    <div className="flex flex-col gap-[8px]">
      {tokens.map((token, index) => (
        <TokenCardFull
          token={token}
          key={"saved_token_" + index}
        ></TokenCardFull>
      ))}
    </div>
  );
}
