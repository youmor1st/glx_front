interface PresetCardProps {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export default function PresetCard({
  icon,
  badge,
  title,
  description,
  onClick,
}: PresetCardProps) {
  return (
    <div
      className="bg-background-8 px-4 py-3 w-full rounded-[12px] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        {icon}
        <div className="bg-violet-accent text-light-100 px-2 py-1  text-sm font-medium rounded-[4px]">
          {badge}
        </div>
      </div>

      <h4 className="text-light-100 font-semibold text-lg">{title}</h4>
      <p className="text-light-40 text-sm font-normal w-[80%]">{description}</p>
    </div>
  );
}
