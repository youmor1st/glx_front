import { Switch } from "./switch";

interface SwitchCardProps {
  title: string;
  description: string;
}

export default function SwitchCard({ title, description }: SwitchCardProps) {
  return (
    <div className="bg-background-8 flex items-center justify-between px-[12px] py-[16px] w-full rounded-[12px]">
      <div className="flex flex-col">
        <h3 className="text-[12px] font-[600] text-light-100">{title}</h3>
        <p className="text-[10px] font-[400] text-light-40">{description}</p>
      </div>
      <Switch className="cursor-pointer"></Switch>
    </div>
  );
}
