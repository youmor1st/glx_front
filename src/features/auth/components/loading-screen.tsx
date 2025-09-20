import * as motion from "motion/react-client";
import { OwlLogoIcon } from "@/shared/ui/icons";

export default function LoadingScreen() {
  return (
    <div className="h-svh bg-primary-200 flex justify-center items-center">
      <div className="flex flex-col gap-3 items-center">
        <OwlLogoIcon className="w-[70px] size-16" />
        <motion.h2
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-gray-100 text-3xl tracking-wide font-medium"
        >
          OwLidar
        </motion.h2>
      </div>
    </div>
  );
}
