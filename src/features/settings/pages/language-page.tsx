import NavHeader from "@/features/navigation/components/nav-header";
import { Button } from "@/shared/ui/button";
import { ArrowIcon } from "@/shared/ui/icons";
import PageWrapper from "@/shared/ui/page-wrapper";
import { RadioGroup } from "@/shared/ui/radio-group";
import RadioOption from "@/shared/ui/radio-option";
import { useNavigate } from "react-router-dom";

export default function LanguagePage() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="">
      <NavHeader
        title="Language"
        left={
          <Button onClick={() => navigate("/settings")}>
            <ArrowIcon className="size-6 fill-light-100" />
          </Button>
        }
      />
      <RadioGroup defaultValue="eg">
        <RadioOption value="eg" id="eg" title="English"></RadioOption>
        <RadioOption value="ru" id="ru" title="Russian"></RadioOption>
      </RadioGroup>
    </PageWrapper>
  );
}
