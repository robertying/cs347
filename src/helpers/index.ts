import { getCssSelector } from "css-selector-generator";
import { ActivityReport, WebsiteData } from "../types";

export function getSelector(element: unknown) {
  return getCssSelector(element, {
    blacklist: ["#grogu-*", "[style=*", "[href=*"],
  });
}

export async function getWebsiteData(url: string) {
  const { data } = await chrome.storage.local.get({ data: {} });
  return data[url] as WebsiteData | undefined;
}

export async function setWebsiteData(url: string, websiteData: WebsiteData) {
  const { data } = await chrome.storage.local.get({ data: {} });
  data[url] = websiteData;
  await chrome.storage.local.set({ data });
}

export async function clearWebsiteData(url: string) {
  const { data } = await chrome.storage.local.get({ data: {} });
  delete data[url];
  await chrome.storage.local.set({ data });
}

export async function clearAllData() {
  await chrome.storage.local.set({ data: {} });
}

export async function exportData() {
  const data = await chrome.storage.local.get(null);
  await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
}

export async function addWebsiteActivity(
  url: string,
  duration: number,
  activityReport: ActivityReport
) {
  const websiteData = (await getWebsiteData(url)) ?? {
    activity: {},
    customization: {},
  };

  for (const [elementSelector, { clickCount }] of Object.entries(
    activityReport
  )) {
    if (!websiteData.activity[elementSelector]) {
      websiteData.activity[elementSelector] = {
        maxFrequency: clickCount / duration,
        clickTotal: clickCount,
      };
    } else {
      websiteData.activity[elementSelector].maxFrequency = Math.max(
        websiteData.activity[elementSelector].maxFrequency,
        clickCount / duration
      );
      websiteData.activity[elementSelector].clickTotal += clickCount;
    }
  }

  await setWebsiteData(url, websiteData);
  console.log(url, await getWebsiteData(url));
}
