import useUserBalance from "@/api/hooks/use-user-balance";
import { GradientOwlLogo, LoadingSpinner } from "../../../shared/ui/icons";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

function Balance() {
  const [owlType, setOwlType] = useState<OwlType>("default");

  const { balance, error, isLoading, pnl } = useUserBalance();

  useEffect(() => {
    if (error) setOwlType("mad");
    if (isLoading && !!error) setOwlType("asleep");
  }, [error, isLoading]);

  return (
    <div className="relative flex flex-col items-center gap-[8px] self-center max-w-11/12 w-fit">
      <div
        className={clsx(
          "h-[74px] border z-10 rounded-[12px] backdrop-blur-md py-[4px] px-[20px] w-full flex items-center justify-center",
          {
            "border-indicator-green/40": owlType === "happy",
            "border-indicator-red/40 bg-indicator-red/10": owlType === "mad",
            "border-secondary-background/40":
              owlType === "default" || owlType === "asleep",
          }
        )}
      >
        <h1 className="text-5xl
        font-semibold
        text-light-100
        text-center
        whitespace-nowrap
        overflow-hidden
        overflow-ellipsis">
          {isLoading ? (
            <LoadingSpinner className="animate-spin size-[36px]"></LoadingSpinner>
          ) : balance ? (
            `$${balance}`
          ) : (
            "-"
          )}
        </h1>
      </div>

      <GradientOwlLogo
        type={owlType}
        className="w-[72px] absolute -top-[48px] -right-[23px] z-0"
      />

      <p className="text-xs font-medium ">
        {isLoading ? (
          <span
            className={twMerge(
              owlType === "mad"
                ? "text-indicator-red"
                : "text-secondary-background/40"
            )}
          >
            Loading balance...
          </span>
        ) : error ? (
          <span className="text-indicator-red">
            Oops! Couldn’t load balance.
          </span>
        ) : (
          <span>
            SOL wallets P&L (3d):
            <span
              className={clsx({
                "text-indicator-green": owlType === "happy",
                "text-indicator-red": owlType === "mad",
                "text-secondary-background/40":
                  owlType === "default" || owlType === "asleep",
              })}
            >
              {" "}
              +${pnl ?? 0}
            </span>
          </span>
        )}
      </p>

      <span
        className={clsx(
          "absolute inset-0 rounded-2xl blur-2xl z-0 opacity-40",
          {
            "bg-indicator-green": owlType === "happy",
            "bg-indicator-red": owlType === "mad",
            "bg-primary-100": owlType === "default" || owlType === "asleep",
          }
        )}
      />
    </div>
  );
}

export default Balance;
