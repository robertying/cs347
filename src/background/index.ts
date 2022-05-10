import { addWebsiteActivity } from "../helpers";
import { ActivityReport } from "../types";

chrome.runtime.onMessage.addListener(async function (request: {
  url: string;
  duration: number;
  activityReport: ActivityReport;
}) {
  const { url, duration, activityReport } = request;
  await addWebsiteActivity(url, duration, activityReport);
});
