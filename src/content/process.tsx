import React from "react";
import ReactDOM from "react-dom/client";
import { url } from "./index";
import App from "./App";
import Thresholds from "../constants/thresholds";
import { getSelector, getWebsiteData, setWebsiteData } from "../helpers";

function sendConfirmation(element: HTMLElement) {
  const root = document.createElement("div");
  root.id = "grogu-confirmation-root";

  if (element.parentNode) {
    element.parentNode.insertBefore(root, element);
    root.appendChild(element);
    root.style.border = "2px solid orange";
    root.style.borderRadius = "12px";
    root.style.padding = "2px";
  }

  console.log("send confirmation", element);

  const popover = document.createElement("div");
  popover.id = "grogu-confirmation-popover";

  ReactDOM.createRoot(popover).render(
    <React.StrictMode>
      <App anchor={element} />
    </React.StrictMode>
  );
}

export async function receiveConfirmation(
  element: HTMLElement,
  customization:
    | {
        enabled: true;
        type: "scale";
        value: number;
      }
    | {
        enabled: false;
      }
) {
  const root = document.getElementById("grogu-confirmation-root");
  if (root) {
    root.style.border = "";
  }

  const elementSelector = getSelector(element);

  const websiteData = await getWebsiteData(url);
  if (!websiteData) {
    return;
  }

  websiteData.customization[elementSelector] = {
    enabled: customization.enabled,
    items: customization.enabled
      ? [
          {
            type: customization.type,
            value: customization.value,
          },
        ]
      : [],
  };
  await setWebsiteData(url, websiteData);

  if (customization.enabled) {
    applyCustomization(elementSelector);
  }
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
    if (item.type === "scale") {
      element.style.transform = `scale(${item.value})`;
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
      maxFrequency < Thresholds.clickFrequency
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
      console.log(elementSelector);
      sendConfirmation(element);
    }
  }
}
