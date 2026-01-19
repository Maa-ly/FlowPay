import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    setParams(params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }): void;
  };
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
  ready(): void;
  expand(): void;
  close(): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  onEvent(eventType: string, callback: () => void): void;
  offEvent(eventType: string, callback: () => void): void;
  sendData(data: string): void;
  openLink(url: string): void;
  openTelegramLink(url: string): void;
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{ id?: string; type?: string; text?: string }>;
  }, callback?: (buttonId: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
}

interface TelegramContextType {
  user: TelegramUser | null;
  isInTelegram: boolean;
  theme: 'light' | 'dark';
  webApp: TelegramWebApp | null;
  expand: () => void;
  close: () => void;
  ready: () => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{ id?: string; type?: string; text?: string }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  hapticFeedback: (type: 'impact' | 'notification' | 'selection', style?: string) => void;
  setMainButton: (params: {
    text?: string;
    color?: string;
    isVisible?: boolean;
    onClick?: () => void;
  }) => void;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    
    if (tg) {
      setIsInTelegram(true);
      setWebApp(tg);
      
      // Initialize Telegram WebApp
      tg.ready();
      tg.expand();
      
      // Get user data
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
        console.log('Telegram user detected:', tg.initDataUnsafe.user);
      }
      
      // Set theme
      const colorScheme = tg.colorScheme || 'light';
      setTheme(colorScheme);
      
      // Apply Telegram theme colors to CSS variables
      if (tg.themeParams) {
        const root = document.documentElement;
        
        if (tg.themeParams.bg_color) {
          root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
        }
        if (tg.themeParams.text_color) {
          root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
        }
        if (tg.themeParams.hint_color) {
          root.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
        }
        if (tg.themeParams.link_color) {
          root.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color);
        }
        if (tg.themeParams.button_color) {
          root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
        }
        if (tg.themeParams.button_text_color) {
          root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
        }
        if (tg.themeParams.secondary_bg_color) {
          root.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color);
        }
      }
      
      console.log('Telegram Web App initialized:', {
        version: tg.version,
        platform: tg.platform,
        theme: colorScheme,
      });
    } else {
      console.log('Not running in Telegram');
    }
  }, []);

  const expand = () => {
    webApp?.expand();
  };

  const close = () => {
    webApp?.close();
  };

  const ready = () => {
    webApp?.ready();
  };
  
  const showPopup = (
    params: {
      title?: string;
      message: string;
      buttons?: Array<{ id?: string; type?: string; text?: string }>;
    },
    callback?: (buttonId: string) => void
  ) => {
    webApp?.showPopup(params, callback);
  };
  
  const showAlert = (message: string, callback?: () => void) => {
    webApp?.showAlert(message, callback);
  };

  const showConfirm = (message: string, callback?: (confirmed: boolean) => void) => {
    webApp?.showConfirm(message, callback);
  };
  
  const hapticFeedback = (
    type: 'impact' | 'notification' | 'selection',
    style: string = 'medium'
  ) => {
    if (!webApp?.HapticFeedback) return;
    
    if (type === 'impact') {
      webApp.HapticFeedback.impactOccurred(style as any);
    } else if (type === 'notification') {
      webApp.HapticFeedback.notificationOccurred(style as any);
    } else if (type === 'selection') {
      webApp.HapticFeedback.selectionChanged();
    }
  };

  const setMainButton = (params: {
    text?: string;
    color?: string;
    isVisible?: boolean;
    onClick?: () => void;
  }) => {
    if (!webApp?.MainButton) return;

    if (params.text) {
      webApp.MainButton.setText(params.text);
    }
    if (params.color) {
      webApp.MainButton.color = params.color;
    }
    if (params.isVisible !== undefined) {
      if (params.isVisible) {
        webApp.MainButton.show();
      } else {
        webApp.MainButton.hide();
      }
    }
    if (params.onClick) {
      webApp.MainButton.onClick(params.onClick);
    }
  };

  const showMainButton = (text: string, onClick: () => void) => {
    if (!webApp?.MainButton) return;
    
    webApp.MainButton.setText(text);
    webApp.MainButton.onClick(onClick);
    webApp.MainButton.show();
  };

  const hideMainButton = () => {
    webApp?.MainButton.hide();
  };

  return (
    <TelegramContext.Provider
      value={{
        user,
        isInTelegram,
        theme,
        webApp,
        expand,
        close,
        ready,
        showPopup,
        showAlert,
        showConfirm,
        hapticFeedback,
        setMainButton,
        showMainButton,
        hideMainButton,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
};
