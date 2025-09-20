import { ArrowRightIcon } from "@/shared/ui/icons";

interface SettingsCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
}

export default function SettingsCard({
  icon,
  title: name,
  description,
  onClick,
}: SettingsCardProps) {
  return (
    <div
      className="bg-background-8 px-[12px] py-[16px] rounded-[12px] flex items-center justify-between hover:bg-light-16 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-[12px]">
        <div className="size-[36px] bg-light-20 p-[8px] rounded-[8px]">
          {icon}
        </div>
        <h3 className="text-[16px] font-[600] text-light-100">{name}</h3>
      </div>
      <div className="flex items-center gap-[8px]">
        <h4 className="text-[12px] font-[500] text-light-40">{description}</h4>
        <ArrowRightIcon className="size-6 flex-shrink-0 fill-secondary-background/40 self-center" />
      </div>
    </div>
  );
}
