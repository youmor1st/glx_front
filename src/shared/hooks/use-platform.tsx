import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export function usePlatform() {
  const lp = retrieveLaunchParams();
  const isDesktop =
    lp.tgWebAppPlatform === "tdesktop" ||
    lp.tgWebAppPlatform === "macos" ||
    lp.tgWebAppPlatform === "weba" ||
    lp.tgWebAppPlatform === "web";

  return { isDesktop };
}
