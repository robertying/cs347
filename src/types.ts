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

export type CustomizationItem =
  | {
      type: "scale";
      value: number;
    }
  | {
      type: "fontSize";
      value: number;
    }
  | {
      type: "color";
      value: string;
    }
  | {
      type: "backgroundColor";
      value: string;
    };

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
