import { twMerge } from "tailwind-merge";

interface SkeletonWalletCard {
  className?: string;
}

export default function SkeletonWalletCard({ className }: SkeletonWalletCard) {
  return (
    <div
      className={twMerge(
        "flex justify-between h-[66px] items-center w-full  rounded-[11px] bg-card px-[12px] py-[16px] backdrop-blur-md)",
        className
      )}
    >
      <div className="w-full flex gap-[8px] h-full">
        <div className="bg-light-10 size-[36px] rounded-[8px] animate-pulse"></div>
        <div className="flex flex-col justify-between w-[80%] h-full">
          <div className="bg-light-10 w-[35%] h-[13px] rounded-[8px] animate-pulse"></div>
          <div className="bg-light-10 w-[60%] h-[13px] rounded-[8px] animate-pulse"></div>
        </div>
      </div>

      <div className="bg-light-10 size-[24px] rounded-[8px] animate-pulse"></div>
    </div>
  );
}
