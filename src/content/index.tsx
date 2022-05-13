import { SHA256 } from "crypto-js";
import { applyCustomizationsToAll, checkFrequency } from "./process";
import { getSelector } from "../helpers";
import { ActivityReport } from "../types";

let startTime = new Date();

// Preserve privacy
export const url = SHA256(window.location.origin).toString();

let activityReport: ActivityReport = {};

document.addEventListener(
  "click",
  (e) => {
    const elementSelector = getSelector(e.target);
    if (!activityReport[elementSelector]) {
      activityReport[elementSelector] = {
        clickCount: 1,
      };
    } else {
      activityReport[elementSelector].clickCount++;
    }
    console.log(activityReport);
  },
  true
);

function sendActivity() {
  const duration = new Date().getTime() - startTime.getTime();
  if (chrome.runtime?.id) {
    chrome.runtime.sendMessage({
      url,
      duration,
      activityReport,
    });
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    sendActivity();
    activityReport = {};
  } else {
    startTime = new Date();
  }
});

window.addEventListener("load", () => {
  applyCustomizationsToAll();
  checkFrequency();
});

window.addEventListener("beforeunload", () => {
  sendActivity();
});
