import { SHA256 } from "crypto-js";
import { applyCustomizationsToAll, checkFrequency } from "./process";
import { getSelector } from "../helpers";
import { ActivityReport } from "../types";

const startTime = new Date();

// Preserve privacy
export const url = SHA256(window.location.origin).toString();

const activityReport: ActivityReport = {};

document.addEventListener("click", (e) => {
  const elementSelector = getSelector(e.target);
  if (!activityReport[elementSelector]) {
    activityReport[elementSelector] = {
      clickCount: 1,
    };
  } else {
    activityReport[elementSelector].clickCount++;
  }
  console.log(activityReport);
});

window.addEventListener("beforeunload", () => {
  const duration = new Date().getTime() - startTime.getTime();
  chrome.runtime?.sendMessage({
    url,
    duration,
    activityReport,
  });
});

applyCustomizationsToAll();
checkFrequency();
