interface TokenStatsProps {
  totalPnl: number;
  pnlPercentage: number;
  transferIn: string;
  transferOut: string;
  avgCost: number;
  soldPrice: number;
  position: number;
  positionCurrent: number;
  positionTotal: number;
  totalBuy: number;
  totalSell: number;
  buyTxns: number;
  sellTxns: number;
}

export default function TokenStats({
  totalPnl,
  pnlPercentage,
  transferIn,
  transferOut,
  avgCost,
  soldPrice,
  position,
  positionCurrent,
  positionTotal,
  totalBuy,
  totalSell,
  buyTxns,
  sellTxns,
}: TokenStatsProps) {
  const positionPercentage = (positionCurrent / positionTotal) * 100;

  return (
    <div className="flex flex-col w-full gap-[28px]">
             <div className="flex flex-col justify-between items-left gap-[4px]">
         <span className="text-[12px]  font-medium text-light-40">
           Total P&L
         </span>
         <div className="flex items-center gap-[4px] ">
           <span className="text-[16px] text-indicator-green font-medium  leading-[16px]">
             ${totalPnl.toFixed(2)}
           </span>
                                               <span className="text-[12px] bg-[#282845] font-medium px-[4px] py-[1px] rounded-[4px] text-[#00D377]">
               +{pnlPercentage.toFixed(2)}%
             </span>
         </div>
       </div>

      <div className="flex justify-between items-left flex-col gap-[4px]">
        <span className="text-[12px] text-light-40 font-medium">
          Transfer in / Transfer out
        </span>
        <div className="flex items-center gap-[8px]">
          <span className="text-[16px] text-light-40 font-medium">
            {transferIn}
          </span>
          <span className="text-[16px] text-light-40 font-medium">/</span>
          <span className="text-[16px] text-light-40 font-medium">
            {transferOut}
          </span>
        </div>
      </div>

             <div className="flex justify-between items-left flex-col gap-[4px]">
         <span className="text-[12px] text-light-40 font-medium">
           Avg Cost / Sold
         </span>
         <div className="flex items-center gap-[8px]">
           <span className="text-[16px] text-indicator-green font-medium">
             ${avgCost.toFixed(8)}
           </span>
           <span className="text-[16px] text-light-40 font-medium">/</span>
           <span className="text-[16px] text-indicator-red font-medium">
             ${soldPrice.toFixed(8)}
           </span>
         </div>
       </div>

             <div className="flex flex-col gap-[4px]">
         <span className="text-[12px] text-light-40 font-medium">
           Position ({positionCurrent.toFixed(2)}M of {positionTotal.toFixed(2)}M)
         </span>
         <span className="text-[16px] text-light-100 font-medium">
           ${position.toFixed(2)}
         </span>
         <div className="flex items-center gap-[8px]">
           <div className="flex-1 h-[4px] bg-light-20 rounded-[2px] overflow-hidden">
             <div
               className="h-full bg-light-100 rounded-[2px]"
               style={{ width: `${positionPercentage}%` }}
             ></div>
           </div>
         </div>
       </div>

      <div className="flex justify-between items-left flex-col gap-[4px]">
        <span className="text-[12px] text-light-40 font-medium">
          Total Buy / Sell
        </span>
        <div className="flex items-center gap-[8px]">
          <span className="text-[16px] text-indicator-green font-medium">
            ${(totalBuy / 1000).toFixed(2)}K
          </span>
          <span className="text-[16px] text-light-40 font-medium">/</span>
          <span className="text-[16px] text-indicator-red font-medium">
            ${(totalSell / 1000).toFixed(2)}K
          </span>
        </div>
      </div>

             <div className="flex justify-between items-left flex-col gap-[4px]">
         <span className="text-[12px] text-light-40 font-medium">
           Numbers of Txns
         </span>
         <div className="flex items-center gap-[4px]">
           <span className="text-[16px] text-indicator-green font-medium">
             {buyTxns}
           </span>
           <span className="text-[16px] text-light-40 font-medium">/</span>
           <span className="text-[16px] text-indicator-red font-medium">
             {sellTxns}
           </span>
         </div>
       </div>
    </div>
  );
} 