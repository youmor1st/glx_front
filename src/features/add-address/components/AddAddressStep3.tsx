import NavHeader from "@/features/navigation/components/nav-header";
import { Button } from "@/shared/ui/button";
import { CrossIcon } from "@/shared/ui/icons";
import { useNavigate } from "react-router-dom";

export const AddAdressStep3 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between flex-1 gap-[32px] items-center">
      <NavHeader
        title="New token address"
        right={
          <Button onClick={() => navigate("/home")}>
            <CrossIcon className="size-6 fill-light-100" />
          </Button>
        }
      />
      <img src="SuccessIllustration.svg" alt="Success!" className="w-full" />
      <div className="flex flex-col gap-[32px] items-center w-full">
        <h3 className="text-light-100 text-center text-[16px] font-semibold w-[280px]">
          Your new token address has been successfully saved
        </h3>
        <Button
          className="w-full"
          variant="big"
          size="big"
          onClick={() => navigate("/home/saved-list")}
        >
          Go to My Saved List
        </Button>
      </div>
    </div>
  );
};
