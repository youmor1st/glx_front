import { usePlatform } from "@/shared/hooks/use-platform";
import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

function PageWrapper({ className, children }: Props) {
  const { isDesktop } = usePlatform();

  return (
    <div
      className={twMerge(
        "sm:max-w-[600px] sm:mx-auto px-[16px] xxs:px-[24px] xs:mx-auto flex flex-col gap-[40px] min-h-svh h-full w-full bg-background-0 pb-[200px]",
        isDesktop ? "pt-[40px]" : "pt-[100px]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default PageWrapper;
