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

export interface CustomizationItem {
  type: "scale";
  value: number;
}

export interface Customization {
  [elementSelector: string]: {
    enabled: boolean;
    items: CustomizationItem[];
  };
}

export interface WebsiteData {
  activity: Activity;
  customization: Customization;
}
