// TypeScript declarations for Google Analytics gtag
// Place this in: src/types/gtag.d.ts or types/gtag.d.ts

interface Window {
  gtag: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: Gtag.ConfigParams | Gtag.EventParams | Gtag.CustomParams
  ) => void;
  dataLayer: any[];
}

declare namespace Gtag {
  interface ConfigParams {
    page_path?: string;
    page_title?: string;
    page_location?: string;
    send_page_view?: boolean;
    [key: string]: any;
  }

  interface EventParams {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: any;
  }

  interface CustomParams {
    [key: string]: any;
  }
}

export {};
