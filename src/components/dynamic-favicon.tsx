"use client";

import * as React from "react";
import { settingsService } from "@/services/settings.service";

export function DynamicFavicon() {
  React.useEffect(() => {
    settingsService.getSettings().then((res) => {
      const faviconUrl = res.data?.faviconUrl;
      if (faviconUrl) {
        let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.getElementsByTagName("head")[0].appendChild(link);
        }
        link.href = faviconUrl;

        // Also update apple-touch-icon if present
        let appleLink = document.querySelector<HTMLLinkElement>("link[rel~='apple-touch-icon']");
        if (!appleLink) {
          appleLink = document.createElement("link");
          appleLink.rel = "apple-touch-icon";
          document.getElementsByTagName("head")[0].appendChild(appleLink);
        }
        appleLink.href = faviconUrl;
      }
    });
  }, []);

  return null;
}
