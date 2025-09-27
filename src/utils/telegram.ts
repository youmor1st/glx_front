/**
 * Telegram WebApp utilities for authentication
 */

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showScanQrPopup: (params: {
    text?: string;
  }, callback?: (text: string) => void) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (text: string) => void) => void;
  requestWriteAccess: (callback?: (granted: boolean) => void) => void;
  requestContact: (callback?: (granted: boolean) => void) => void;
  hapticFeedback: (type: 'impact' | 'notification' | 'selection', style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  cloudStorage: {
    setItem: (key: string, value: string, callback?: (error: string | null, result: boolean) => void) => void;
    getItem: (key: string, callback: (error: string | null, result: string | null) => void) => void;
    getItems: (keys: string[], callback: (error: string | null, result: Record<string, string>) => void) => void;
    removeItem: (key: string, callback?: (error: string | null, result: boolean) => void) => void;
    removeItems: (keys: string[], callback?: (error: string | null, result: boolean) => void) => void;
    getKeys: (callback: (error: string | null, result: string[]) => void) => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }) => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

/**
 * Get Telegram WebApp instance
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

/**
 * Check if we're running inside Telegram WebApp
 */
export function isTelegramWebApp(): boolean {
  return getTelegramWebApp() !== null;
}

/**
 * Get Telegram Init Data
 */
export function getTelegramInitData(): string | null {
  const webApp = getTelegramWebApp();
  return webApp?.initData || null;
}

/**
 * Get Telegram user data
 */
export function getTelegramUser(): TelegramUser | null {
  const webApp = getTelegramWebApp();
  return webApp?.initDataUnsafe?.user || null;
}

/**
 * Get Telegram user ID
 */
export function getTelegramUserId(): number | null {
  const user = getTelegramUser();
  return user?.id || null;
}

/**
 * Check if Telegram user is available
 */
export function hasTelegramUser(): boolean {
  return getTelegramUser() !== null;
}

/**
 * Initialize Telegram WebApp
 */
export function initTelegramWebApp(): void {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.ready();
    webApp.expand();
  }
}

/**
 * Show Telegram alert
 */
export function showTelegramAlert(message: string): Promise<void> {
  return new Promise((resolve) => {
    const webApp = getTelegramWebApp();
    if (webApp) {
      webApp.showAlert(message, resolve);
    } else {
      alert(message);
      resolve();
    }
  });
}

/**
 * Show Telegram confirmation dialog
 */
export function showTelegramConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const webApp = getTelegramWebApp();
    if (webApp) {
      webApp.showConfirm(message, resolve);
    } else {
      resolve(confirm(message));
    }
  });
}

/**
 * Haptic feedback
 */
export function triggerHapticFeedback(
  type: 'impact' | 'notification' | 'selection' = 'impact',
  style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium'
): void {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.hapticFeedback(type, style);
  }
}

/**
 * Close Telegram WebApp
 */
export function closeTelegramWebApp(): void {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.close();
  }
}

/**
 * Open external link
 */
export function openTelegramLink(url: string): void {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.openTelegramLink(url);
  } else {
    window.open(url, '_blank');
  }
}

/**
 * Open regular link
 */
export function openLink(url: string, tryInstantView = false): void {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.openLink(url, { try_instant_view: tryInstantView });
  } else {
    window.open(url, '_blank');
  }
}
