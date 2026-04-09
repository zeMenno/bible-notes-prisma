"use client";

import dynamic from "next/dynamic";

export const PwaHomeInstallBlockLazy = dynamic(
  () =>
    import("@/components/site/pwa-install").then((mod) => ({
      default: mod.PwaHomeInstallBlock,
    })),
  {
    ssr: false,
    loading: () => (
      <p className="text-center text-xs text-muted-foreground sm:text-right">
        Loading install options…
      </p>
    ),
  },
);

export const PwaInstallCalloutLazy = dynamic(
  () =>
    import("@/components/site/pwa-install").then((mod) => ({
      default: mod.PwaInstallCallout,
    })),
  { ssr: false },
);
