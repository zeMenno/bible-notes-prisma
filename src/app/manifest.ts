import type { MetadataRoute } from "next";
import {
  siteBackgroundColor,
  siteDescription,
  siteName,
  siteThemeColor,
} from "@/lib/site-meta";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: siteBackgroundColor,
    theme_color: siteThemeColor,
    icons: [
      {
        src: "/icons/icon_192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon_512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
