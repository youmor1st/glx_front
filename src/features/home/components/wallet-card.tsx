import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  ArrowRightIcon,
  EthereumLogoIcon,
  SolanaLogoIcon,
} from "@/shared/ui/icons";
import {
  formatAddress,
  formatThousands,
  formatTwoDecimals,
} from "@/shared/lib/formatter";
import { useNavigate } from "react-router-dom";
import { isValidEthAddress, isValidSolAddress } from "@/shared/lib/utils";
import { useMemo } from "react";

interface Props {
  name: string;
  blockchain: BlockchainType;
  glow?: boolean;
  tokens: number;
  each: number;
  pnl: number;
  profit: number;
  swaps: number;
  address: string;
}

function WalletCard({
  name,
  blockchain = "SOL",
  tokens,
  each,
  pnl,
  profit,
  swaps,
  glow = false,
  address,
}: Props) {
  const angle = useMotionValue(0);
  const navigate = useNavigate();

  useAnimationFrame((t) => glow && angle.set((t / 15) % 360));
  const background = useTransform(
    angle,
    (a) => `linear-gradient(${a}deg, #6A4BBE, #171339)`
  );

  const handleClick = () => {
    navigate(`/home/wallet-info/${address}`);
  };

  const isValidAddress = (s: string) =>
    isValidEthAddress(s) || isValidSolAddress(s);

  const displayName = useMemo(() => {
    const newName = name?.trim();
    if (!newName) return formatAddress(address);
    return isValidAddress(newName) ? formatAddress(newName) : newName;
  }, [name, address]);

  const carouselItems = [
    <div className="h-[16px] flex text-xs text-secondary-background/40">
      Holds {tokens} tokens
      <ArrowRightIcon className="fill-secondary-background/40 size-3 ml-1" />
      <span className="text-indicator-green ml-1">
        ${formatThousands(each)} each
      </span>
    </div>,
    <div className="h-[16px] flex text-xs text-secondary-background/40">
      P&L (7 d):
      <span className="text-indicator-green ml-1">
        ${formatThousands(profit)} ({formatTwoDecimals(pnl * 100)}%)
      </span>
    </div>,
    <div className="h-[16px] flex text-xs text-secondary-background/40">
      Total swaps:
      <span className="text-indicator-green ml-1">{swaps}</span>
    </div>,
  ];

  const Card = (
    <div
      onClick={handleClick}
      className="relative flex h-[66px] w-full  rounded-[11px] bg-card hover:bg-light-16 cursor-pointer  px-[12px] py-[16px] backdrop-blur-md"
    >
      {blockchain === "ETH" ? (
        <EthereumLogoIcon className="size-8 mr-[12px] flex-shrink-0" />
      ) : (
        <SolanaLogoIcon className="size-8 mr-[12px] flex-shrink-0" />
      )}

      <div className="flex flex-col grow">
        <h3 className="text-xs font-semibold text-light-100">{displayName}</h3>

        <div className="">
          <Swiper
            direction="vertical"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            slidesPerView={1}
            allowTouchMove={false}
            loop
            modules={[Autoplay]}
            className="h-[16px]"
          >
            {carouselItems.map((item, index) => (
              <SwiperSlide key={index}>{item}</SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <ArrowRightIcon className="ml-2 size-6 flex-shrink-0 fill-secondary-background/40 self-center" />
    </div>
  );

  return glow ? (
    <motion.div
      style={{ background }}
      className="relative h-[68px] overflow-hidden rounded-[12px] p-[1px]"
    >
      {Card}
    </motion.div>
  ) : (
    <div className="relative h-[68px] overflow-hidden rounded-[12px] bg-secondary-background/8 p-[1px]">
      {Card}
    </div>
  );
}

export default WalletCard;
