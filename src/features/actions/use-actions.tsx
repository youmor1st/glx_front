import { ReceiveDrawer } from "@/features/receive/pages/receive-drawer";
import { AddIcon, AnalyticsIcon, SwapIcon } from "@/shared/ui/icons";
import { useNavigate } from "react-router-dom";
import ActionButton from "./components/action-button";

export const useActionConfigs = (): React.ReactElement[] => {
  const navigate = useNavigate();

  return [
    <ReceiveDrawer key="receive" />,
    <ActionButton
      icon={<SwapIcon />}
      label="Swap"
      onClick={() => navigate("/swap")}
    />,
    <ActionButton
      key="analytics"
      icon={<AnalyticsIcon />}
      label="Analytics"
      onClick={() => navigate("/analytics")}
    />,
    <ActionButton
      key="add-address"
      icon={<AddIcon />}
      label="Add address"
      onClick={() => navigate("/add-address")}
    />,
  ];
};
