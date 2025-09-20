import AddAddressPage from "@/features/add-address/pages/add-address-page";
import SavedListPage from "@/features/saved-list/pages/saved-list-page";
import { SwapPage } from "@/features/swap/pages/swap-page";
import { HomePage } from "@/features/home/pages/home-page";
import HotPerformingPage from "@/features/hot-performing/pages/hot-performing-page";
import {
  HomeIcon,
  AnalyticsIcon,
  SettingsIcon,
  SwapIcon,
  AddIcon,
} from "@/shared/ui/icons";
import type { ComponentType } from "react";
import WalletInfoPage from "@/features/wallet-info/pages/wallet-info-page";
import SettingsPage from "@/features/settings/pages/settings-page";
import NotificationsPage from "@/features/settings/pages/notifications-page";
import LanguagePage from "@/features/settings/pages/language-page";
import AnalyticsPage from "@/features/analytics/pages/analytics-page";
import WalletPresetsPage from "@/features/analytics/pages/wallet-presets-page";
import CustomWalletPresetPage from "@/features/analytics/pages/custom-wallet-preset-page";
import TokenPresetsPage from "@/features/analytics/pages/token-presets-page";
import CustomTokenPresetPage from "@/features/analytics/pages/custom-token-preset-page";



import SubscriptionPage from "@/features/subscriptions/pages/subscription-page.tsx";
import SwitchPlanPage from "@/features/subscriptions/pages/switch-plan-page.tsx";
import PlanDetailsPage from "@/features/subscriptions/pages/plan-details-page.tsx";
import CheckoutPage from "@/features/subscriptions/pages/checkout-page.tsx";


type RouteType = {
  path: string;
  icon?: React.ReactElement;
  label: string;
  Component: ComponentType;
};

export const routes: RouteType[] = [
  {
    path: "/home",
    icon: <HomeIcon />,
    label: "Home",
    Component: HomePage,
  },
  {
    path: "/analytics",
    icon: <AnalyticsIcon />,
    label: "Analytics",
    Component: AnalyticsPage,
  },
  {
    path: "/swap",
    icon: <SwapIcon />,
    label: "Swap",
    Component: SwapPage,
  },
  {
    path: "/settings",
    icon: <SettingsIcon />,
    label: "Setting",
    Component: SettingsPage,
  },
  {
    path: "/add-address",
    icon: <AddIcon />,
    label: "Add address",
    Component: AddAddressPage,
  },
  {
    path: "/home/saved-list",
    label: "Saved lists",
    Component: SavedListPage,
  },
  {
    path: "/home/wallet-info/:walletId",
    label: "Wallet Info",
    Component: WalletInfoPage,
  },
  {
    path: "/hot-performing",
    label: "Hot performing",
    Component: HotPerformingPage,
  },
  {
    path: "/notifications",
    label: "Notifications",
    Component: NotificationsPage,
  },
  {
    path: "/language",
    label: "Language",
    Component: LanguagePage,
  },
  {
    path: "/analytics/wallet-presets",
    icon: <AnalyticsIcon />,
    label: "Wallet Presets",
    Component: WalletPresetsPage,
  },
  {
    path: "/analytics/token-presets",
    label: "Token Presets",
    Component: TokenPresetsPage,
  },
  {
    path: "/analytics/preset",
    label: "Preset",
    Component: CustomWalletPresetPage,
  },
  {
    path: "/analytics/token",
    label: "Preset",
    Component: CustomTokenPresetPage,
  },

  {
    path: "/subscription",
    label: "Subscription",
    Component: SubscriptionPage,
  },
  {
    path: "/subscription/switch",
    label: "Switch Plan",
    Component: SwitchPlanPage,
  },
  {
    path: "/subscription/plan/:plan",
    label: "Plan",
    Component: PlanDetailsPage,
  },
  {
    path: "/subscription/checkout/:duration",
    label: "Checkout",
    Component: CheckoutPage,
  },

];
