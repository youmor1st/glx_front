import SegmentControl from "@/features/saved-list/components/segment-control";
import { useState } from "react";
import TokensChartRow from "./tokens-chart-row";

export default function TokensChart() {
  const [selectedValue, setSelectedValue] =
    useState<TokensSegmentControlType>("roi");

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between w-full">
        <h3 className="text-[16px] font-semibold light-100">Best Token (7d)</h3>
        <SegmentControl
          options={[
            { label: "ROI", value: "roi" },
            { label: "Profit", value: "profit" },
          ]}
          className="w-[140px] h-[40px]"
          selectedValue={selectedValue}
          setSelectedValue={(value: string) =>
            setSelectedValue(value as TokensSegmentControlType)
          }
        />
      </div>
      <div className="flex flex-col w-full gap-[12px] py-[12px]">
        <TokensChartRow
          name="KAPPA"
          roi={319.7}
          widthPercentage={30}
        ></TokensChartRow>
        <TokensChartRow
          name="KAPPA"
          roi={319.7}
          widthPercentage={23}
        ></TokensChartRow>
        <TokensChartRow
          name="whiteski"
          roi={319.7}
          widthPercentage={9}
        ></TokensChartRow>
        <TokensChartRow
          name="whiteski"
          roi={3319.7}
          widthPercentage={20}
        ></TokensChartRow>
        <TokensChartRow
          name="whiteski"
          roi={319.7}
          widthPercentage={11}
        ></TokensChartRow>
      </div>
    </div>
  );
}
