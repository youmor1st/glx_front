import { Button } from "@/shared/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";

interface AgreementSection {
  title: string;
  subtitle?: string;
  list?: string[];
}

interface SwapAgreementProps {
  isOpen: boolean;
  onClose: () => void;
}

const agreementData: AgreementSection[] = [
  {
    title: "1. No Financial Advice",
    subtitle:
      "OwLidar is a technology platform providing tools for blockchain asset swaps and market data analysis.",
    list: [
      "We do NOT provide investment, trading, legal, tax, or other financial advice.",
      "Any decision to execute a swap through our Platform is made solely by you and based on your own evaluation of the risks and potential outcomes.",
    ],
  },
  {
    title: "2. User Responsibility",
    list: [
      "You are fully responsible for all trades and swaps executed through OwLidar.",
      "You must conduct your own research and ensure you have sufficient knowledge of the assets and the mechanics of blockchain transactions before swapping.",
      "All swaps are final and irreversible once confirmed on the blockchain.",
    ],
  },
  {
    title: "3. Fees",
    list: [
      "OwLidar charges a 1% platform fee on the notional value of each swap.",
      "This fee is in addition to any blockchain network (gas) fees, liquidity provider fees, slippage, or third-party costs that may apply.",
      "The 1% platform fee will be displayed in your transaction summary prior to confirmation.",
    ],
  },
  {
    title: "4. Risk Disclosure",
    subtitle: "You acknowledge that:",
    list: [
      "The value of digital assets is highly volatile.",
      "Prices may fluctuate significantly within short periods.",
      "You may lose all or part of your traded assets.",
      "Past performance of any asset or wallet is NOT indicative of future results.",
    ],
  },
  {
    title: "5. Limitation of Liability",
    list: [
      "OwLidar, its owners, affiliates, and partners shall NOT be liable for any direct, indirect, incidental, special, or consequential losses arising from your use of the Platform or any swap executed on it.",
      "You waive any claim against OwLidar relating to trading losses, missed opportunities, or technical issues, except where prohibited by applicable law.",
    ],
  },
  {
    title: "6. Acknowledgment and Consent",
    subtitle: 'By clicking "I Agree & Proceed," you confirm that you:',
    list: [
      "Have read and understood this Swap Disclaimer & User Agreement.",
      "Accept full responsibility for your trading decisions.",
      "Consent to the 1% platform fee per swap.",
      "Understand that all swaps are final and irreversible.",
    ],
  },
];

export function SwapAgreement({ isOpen, onClose }: SwapAgreementProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose} modal={false}>
      <DrawerContent className="bg-[#1F1E3B] ">
        <DrawerHeader className="flex items-start  py-[15px] pl-[0]">
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </DrawerClose>
          <DrawerDescription className="sr-only">
            Full agreement text
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-[12px] max-h-[70vh] overflow-y-auto pt-[20px] pb-[26px]">
          <DrawerTitle className="text-[20px] font-bold text-light-100 text-left flex-1">
            OwLidar Swap Disclaimer & User Agreement
          </DrawerTitle>
          {/* Effective Date */}
          <div className="text-light-60 text-[10px] text-left">
            Effective Date: {new Date().toLocaleDateString()}
          </div>

          {/* Agreement Sections */}
          {agreementData.map((section, index) => (
            <div key={index} className="flex flex-col gap-[12px]">
              <h3 className="text-light-100 text-[16px] font-bold">
                {section.title}
              </h3>
              <div className="text-light-60 text-[12px] leading-[100%] ">
                {section.subtitle && (
                  <p className="mb-[12px]">{section.subtitle}</p>
                )}
                {section.list && (
                  <ul className="list-disc list-inside space-y-[4px]">
                    {section.list.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}

export default SwapAgreement;
