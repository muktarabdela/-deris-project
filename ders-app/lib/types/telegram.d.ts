export {};

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
            language_code?: string;
            photo_url?: string;
          };
          auth_date?: string;
          [key: string]: any;
        };
        expand: () => void;
        close: () => void;
        sendData: (data: string) => void;
        isExpanded: boolean;
        version: string;
        platform: string;
      };
    };
  }
}
