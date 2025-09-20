import { initUtils } from "@telegram-apps/sdk";

export function useTelegramShareURL() {
  try {
    const utils = initUtils();

    const shareURL = (url: string, text?: string) => utils.shareURL(url, text);

    return { shareURL };
  } catch (error) {
    const shareURL = () => console.error(error);

    return { shareURL };
  }
}
