import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface WalletInfoChartRowProps {
  heightPercentage: number;
  date: string;
  time: string;
}

export default function WalletInfoChartRow({
  heightPercentage,
  date,
  time,
}: WalletInfoChartRowProps) {
  return (
    <Popover>
      <div className="flex flex-col-reverse gap-[8px] h-[188px] w-[36px]">
        <div className="flex flex-col">
          <p className="text-[10px] font-normal text-light-40 text-center">
            {time}
          </p>
          <p className="text-[10px] font-normal text-light-40 text-center">
            {date}
          </p>
        </div>
        <div className="h-[150px] flex flex-col-reverse">
          <PopoverTrigger
            className="bg-indicator-green rounded-[4px]"
            style={{ height: `${heightPercentage}%` }}
          ></PopoverTrigger>
        </div>
      </div>

      <PopoverContent className="bg-background-0 flex flex-col px-[12px] py-[8px] gap-[8px]">
        <div className="flex gap-[4px]">
          <div className="px-[4px] py-[2px] bg-light-20 rounded-[4px] text-light-60 text-[12px] font-[500]">
            {time}
          </div>
          <div className="px-[4px] py-[2px] bg-light-20 rounded-[4px] text-light-60 text-[12px] font-[500]">
            {date}
          </div>
        </div>
        <div className="text-[12px] text-light-100 font-[500]">Txns: 1553</div>
        <div className="text-[12px] text-light-100 font-[500]">
          Vol: $480.83K
        </div>
      </PopoverContent>
    </Popover>
  );
}
