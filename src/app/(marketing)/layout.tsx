import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full min-w-0 flex-col overflow-x-clip bg-background text-foreground">
      <SiteHeader />
      <div className="min-w-0 flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
