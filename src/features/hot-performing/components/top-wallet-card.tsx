import { TopWallet } from "../types";
import { Avatar } from "@radix-ui/react-avatar";
import {
  ArrowRightIcon,
  EthereumLogoIcon,
  SolanaLogoIcon,
} from "@/shared/ui/icons";
import { twMerge } from "tailwind-merge";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";

// SVG медали для топ-3 кошельков
const Top1Icon = () => (
  <img src="/topgold.svg" alt="1st place" className="w-6 h-6" />
);
const Top2Icon = () => (
  <img src="/topsilver.svg" alt="2nd place" className="w-6 h-6" />
);
const Top3Icon = () => (
  <img src="/topbronze.svg" alt="3rd place" className="w-6 h-6" />
);

interface TopWalletCardProps {
  wallet: TopWallet;
  onClick?: (wallet: TopWallet) => void;
  className?: string;
}

export function TopWalletCard({
  wallet,
  onClick,
  className,
}: TopWalletCardProps) {
  // Цвета для топ-3
  const borderColors = {
    top1: ["#FFD600", "#FFF7AE"], // gold
    top2: ["#B0B8C1", "#E0E5EC"], // silver
    top3: ["#FF8A00", "#FFD6AE"], // bronze
  };
  const isTop =
    wallet.variant === "top1" ||
    wallet.variant === "top2" ||
    wallet.variant === "top3";

  // Анимация градиентного бордера
  const angle = useMotionValue(0);
  useAnimationFrame((t) => {
    if (isTop) angle.set((t / 10) % 360); // Ускорил анимацию
  });
  const borderGradient = useTransform(
    angle,
    (a) =>
      `linear-gradient(${a}deg, ${
        wallet.variant === "top1"
          ? borderColors.top1.join(", ")
          : wallet.variant === "top2"
          ? borderColors.top2.join(", ")
          : borderColors.top3.join(", ")
      })`
  );

  const handleClick = () => {
    onClick?.(wallet);
  };

  const CardContent = (
    <div
      className={twMerge(
        "relative flex h-[66px] w-full rounded-[11px] bg-card px-[12px] py-[16px] backdrop-blur-md items-center cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      {/* Ранг и иконка */}
      <div className="flex flex-col items-center w-8 mr-3">
        {isTop ? (
          <span className="w-6 h-6 flex items-center justify-center rounded-full">
            {wallet.rank === 1 ? (
              <Top1Icon />
            ) : wallet.rank === 2 ? (
              <Top2Icon />
            ) : (
              <Top3Icon />
            )}
          </span>
        ) : (
          <span className="text-xs text-light-40 font-bold">{wallet.rank}</span>
        )}
      </div>
      {/* Блокчейн-аватар */}
      <Avatar className="w-9 h-9 flex items-center justify-center bg-background-0 rounded-full mr-3">
        {wallet.blockchain === "eth" ? (
          <EthereumLogoIcon className="w-6 h-6" />
        ) : (
          <SolanaLogoIcon className="w-6 h-6" />
        )}
      </Avatar>
      {/* Информация */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-light-100 font-semibold text-sm truncate">
            {wallet.name}
          </span>
          {wallet.pnl && (
            <span
              className={twMerge(
                "text-xs font-medium",
                wallet.pnl.startsWith("+")
                  ? "text-indicator-green"
                  : "text-indicator-red"
              )}
            >
              {wallet.pnl}
            </span>
          )}
        </div>
        <div className="text-xs text-light-40 truncate">{wallet.address}</div>
        {(wallet.tokens || wallet.swaps) && (
          <div className="flex gap-2 mt-1">
            {wallet.tokens && (
              <span className="text-xs text-light-60">
                {wallet.tokens} tokens
              </span>
            )}
            {wallet.swaps && (
              <span className="text-xs text-light-60">
                {wallet.swaps} swaps
              </span>
            )}
          </div>
        )}
      </div>
      <ArrowRightIcon className="ml-2 size-6 flex-shrink-0 fill-secondary-background/40 self-center" />
    </div>
  );

  // Для топ-3 — анимированный бордер, для остальных — обычный контейнер
  return isTop ? (
    <motion.div
      style={{ background: borderGradient }}
      className={twMerge(
        "relative h-[68px] overflow-hidden rounded-[12px] p-[1px] mb-2"
      )}
    >
      {CardContent}
    </motion.div>
  ) : (
    <div
      className={twMerge(
        "relative h-[68px] overflow-hidden rounded-[12px] bg-secondary-background/8 p-[1px] mb-2"
      )}
    >
      {CardContent}
    </div>
  );
}
