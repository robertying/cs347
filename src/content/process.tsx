import React from "react";
import ReactDOM from "react-dom/client";
import { url } from "./index";
import App from "./App";
import { FrequencyThresholdStepRatio, Thresholds } from "../constants";
import { getSelector, getWebsiteData, setWebsiteData } from "../helpers";
import { CustomizationItem } from "../types";

function sendConfirmation(element: HTMLElement) {
  const previousStyle = {
    border: element.style.border,
    borderRadius: element.style.borderRadius,
  };
  element.style.border = "2px solid orange";
  element.style.borderRadius = "8px";

  const popover = document.createElement("div");
  popover.id = "grogu-confirmation-root";
  element.parentNode?.insertBefore(popover, element.nextSibling);

  ReactDOM.createRoot(popover).render(
    <React.StrictMode>
      <App anchor={element} anchorStyle={previousStyle} />
    </React.StrictMode>
  );
}

export async function receiveConfirmation(
  element: HTMLElement,
  previousStyle: {
    border: string;
    borderRadius: string;
  },
  customization:
    | {
        enabled: true;
        items: CustomizationItem[];
      }
    | {
        enabled: false;
      }
) {
  element.style.border = previousStyle.border;
  element.style.borderRadius = previousStyle.borderRadius;

  const elementSelector = getSelector(element);

  const websiteData = await getWebsiteData(url);
  if (!websiteData) {
    return;
  }

  if (customization.enabled) {
    websiteData.frequencyThreshold *= 1 - FrequencyThresholdStepRatio;
  } else {
    websiteData.frequencyThreshold *= 1 + FrequencyThresholdStepRatio;
  }

  websiteData.customization[elementSelector] = {
    enabled: customization.enabled,
    items: customization.enabled ? customization.items : [],
  };
  await setWebsiteData(url, websiteData);
}

export async function getElementCustomization(elementSelector: string) {
  const websiteData = await getWebsiteData(url);
  if (!websiteData) {
    return undefined;
  }

  return websiteData.customization[elementSelector];
}

async function applyCustomization(elementSelector: string) {
  const element = document.querySelector(elementSelector) as HTMLElement | null;
  if (!element) {
    return;
  }

  const customization = await getElementCustomization(elementSelector);
  if (!customization || !customization.enabled) {
    return;
  }

  for (const item of customization.items) {
    switch (item.type) {
      case "scale":
        element.style.transform = `scale(${item.value})`;
        break;
      case "fontSize":
        element.style.fontSize = `calc(${
          window.getComputedStyle(element).fontSize
        } * ${item.value})`;
        break;
      case "color":
        element.style.setProperty("color", item.value, "important");
        break;
      case "backgroundColor":
        element.style.setProperty("background-color", item.value, "important");
        break;
    }
  }
}

export async function applyCustomizationsToAll() {
  const websiteData = await getWebsiteData(url);
  if (!websiteData) {
    return;
  }

  for (const [elementSelector, { enabled }] of Object.entries(
    websiteData.customization
  )) {
    if (enabled) {
      applyCustomization(elementSelector);
    }
  }
}

export async function checkFrequency() {
  const websiteData = await getWebsiteData(url);
  if (!websiteData) {
    return;
  }
  console.log(websiteData);
  for (const [elementSelector, { clickTotal, maxFrequency }] of Object.entries(
    websiteData.activity
  )) {
    if (
      clickTotal < Thresholds.clickCount ||
      maxFrequency < websiteData.frequencyThreshold
    ) {
      continue;
    }
    const element = document.querySelector(
      elementSelector
    ) as HTMLElement | null;
    if (!element) {
      continue;
    }

    const elementCustomization = websiteData.customization[elementSelector];
    if (!elementCustomization) {
      console.log("send confirmation to");
      console.log(element);
      console.log(elementSelector);
      sendConfirmation(element);
      break;
    }
  }
}
