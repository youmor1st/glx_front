import PageWrapper from "@/shared/ui/page-wrapper";
import SettingsCard from "../components/settings-card";
import {
  BellIcon,
  CrownIcon,
  LanguageIcon,
  MessageIcon,
  QuestionIcon,
} from "@/shared/ui/icons";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="gap-[28px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[12px] font-[500] text-light-40">Account</h2>
        <SettingsCard
          onClick={() => navigate("/subscription")}
          title="Subscription"
          description="Until June 30, 2025"
          icon={<CrownIcon className="size-[20px] fill-light-100"></CrownIcon>}
        ></SettingsCard>
      </div>
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[12px] font-[500] text-light-40">Notifications</h2>
        <SettingsCard
          onClick={() => navigate("/notifications")}
          title="Notifications"
          description="100"
          icon={<BellIcon className="size-[20px] fill-light-100"></BellIcon>}
        ></SettingsCard>
      </div>
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[12px] font-[500] text-light-40">Help & Support</h2>
        <SettingsCard
          title="FAQ"
          icon={
            <QuestionIcon className="size-[20px] fill-light-100"></QuestionIcon>
          }
        ></SettingsCard>
        <SettingsCard
          title="Contact Support"
          icon={
            <MessageIcon className="size-[20px] fill-light-100"></MessageIcon>
          }
        ></SettingsCard>
      </div>
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[12px] font-[500] text-light-40">Preferences</h2>

        <SettingsCard
          title="App Language"
          description="English"
          onClick={() => navigate("/language")}
          icon={
            <LanguageIcon className="size-[20px] fill-light-100"></LanguageIcon>
          }
        ></SettingsCard>
      </div>
    </PageWrapper>
  );
}
