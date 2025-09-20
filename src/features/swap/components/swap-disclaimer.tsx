import { useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import { AlertIcon } from "@/shared/ui/icons";
import SwapAgreement from "./swap-agreement";

interface SwapDisclaimerProps {
  trigger: React.ReactNode;
  onAgree: () => void;
  onCancel: () => void;
}

export function SwapDisclaimer({
  trigger,
  onAgree,
  onCancel,
}: SwapDisclaimerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const handleAgree = () => {
    if (isAgreed) {
      onAgree();
      setIsOpen(false);
      setIsAgreed(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
    setIsAgreed(false);
  };

  const handleLearnMore = () => {
    setShowAgreement(true);
  };

  const handleAgreementClose = () => {
    setShowAgreement(false);
  };

  return (
    <>
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
        }}
        modal={false}
      >
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="bg-[#1F1E3B]">
          <div className="flex flex-col items-center pt-[28px] pb-[14px]">
            {/* Header with icon */}
            <div className="flex flex-col items-center gap-[12px]">
              <div className="w-[48px] h-[48px] flex items-center justify-center">
                <AlertIcon className="w-[48px] h-[48px] text-light-100" />
              </div>
              <h2 className="text-light-100 text-[20px] font-bold text-center">
                OwLidar Swap Disclaimer
              </h2>
            </div>

            {/* Disclaimer text */}
            <div className="text-light-60 text-[12px] leading-[100%] text-center mb-[12px] mt-[4px]">
              By using OwLidar, you acknowledge that all swaps are final, you
              trade at your own risk, and no financial advice is provided.
              Digital assets are volatile — you may lose all or part of your
              funds. A 1% platform fee applies in addition to network and
              third-party costs.
            </div>

            {/* Learn More link */}
            <div
              className="flex items-center gap-[8px] text-[#9266FF] text-[12px] cursor-pointer"
              onClick={handleLearnMore}
            >
              <div className="w-[16px] h-[16px] rounded-full bg-[#9266FF] flex items-center justify-center">
                <span className="text-light-100 text-[10px] font-bold">i</span>
              </div>
              <span>Learn More</span>
            </div>

            {/* Divider line */}
            <div className="w-full h-[1px] bg-[#282845] my-[20px]"></div>

            {/* Agreement checkbox */}
            <div className="flex items-center  gap-[12px] mb-[36px] w-full">
              <label className="flex items-center w-full justify-between gap-[16px] bg-light-20 rounded-[8px] px-[12px] py-[8px] cursor-pointer">
                <span className="text-light-60 text-[12px]">
                  I have read and agree to the{" "}
                  <span
                    className="text-[#9266FF] underline"
                    onClick={handleLearnMore}
                  >
                    Swap Disclaimer & User Agreement
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="w-[24px] h-[24px] rounded border border-light-100 bg-transparent checked:bg-[#9266FF] checked:border-[#9266FF]"
                />
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-[12px] w-full">
              <Button
                onClick={handleAgree}
                disabled={!isAgreed}
                className="w-full bg-[#9266FF] text-light-100 py-[16px] text-[16px] font-semibold rounded-[100px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                I Agree & Proceed
              </Button>
              <Button
                onClick={handleCancel}
                variant="ghost"
                className="w-full bg-light-20 text-light-100 py-[16px] text-[16px] font-semibold rounded-[100px] hover:opacity-40"
              >
                Cancel
              </Button>
            </div>
            <DrawerFooter />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Full Agreement Modal */}
      <SwapAgreement isOpen={showAgreement} onClose={handleAgreementClose} />
    </>
  );
}

export default SwapDisclaimer;
