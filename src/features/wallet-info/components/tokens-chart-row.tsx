interface TokensChartRowProps {
  name: string;
  widthPercentage: number;
  roi: number;
}

export default function TokensChartRow({
  name,
  roi,
  widthPercentage,
}: TokensChartRowProps) {
  return (
    <div className="flex h-[16px] gap-[8px] w-full items-center">
      <h4 className="text-[12px] font-semibold text-light-100 w-[64px] text-end">
        {name}
      </h4>
      <div
        className="bg-indicator-green h-full rounded-[4px]"
        style={{ width: `${widthPercentage}%` }}
      ></div>
      <h4 className="text-[12px] font-semibold text-indicator-green  text-right">
        ${roi}
      </h4>
    </div>
  );
}
