export interface Activity {
  [elementSelector: string]: {
    maxFrequency: number;
    clickTotal: number;
  };
}

export interface ActivityReport {
  [elementSelector: string]: {
    clickCount: number;
  };
}

export interface Customization {
  [elementSelector: string]: {
    enabled: boolean;
  };
}

export interface WebsiteData {
  activity: Activity;
  customization: Customization;
}
