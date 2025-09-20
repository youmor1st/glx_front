import WalletInfoChartRow from "./wallet-info-chart-row";

export default function WalletInfoChart() {
  return (
    <div className="bg-light-10 p-[16px] h-[220px] rounded-[12px] flex gap-[12px] items-end overflow-x-scroll scrollbar-hidden">
      <WalletInfoChartRow heightPercentage={20} date="25/05" time="08:00" />
      <WalletInfoChartRow heightPercentage={40} date="25/05" time="09:00" />
      <WalletInfoChartRow heightPercentage={60} date="25/05" time="10:00" />
      <WalletInfoChartRow heightPercentage={80} date="25/05" time="11:00" />
      <WalletInfoChartRow heightPercentage={10} date="25/05" time="12:00" />
      <WalletInfoChartRow heightPercentage={40} date="25/05" time="09:00" />
      <WalletInfoChartRow heightPercentage={65} date="25/05" time="10:00" />
      <WalletInfoChartRow heightPercentage={8} date="25/05" time="11:00" />
      <WalletInfoChartRow heightPercentage={93} date="25/05" time="12:00" />
      <WalletInfoChartRow heightPercentage={40} date="25/05" time="09:00" />
      <WalletInfoChartRow heightPercentage={60} date="25/05" time="10:00" />
      <WalletInfoChartRow heightPercentage={80} date="25/05" time="11:00" />
    </div>
  );
}
