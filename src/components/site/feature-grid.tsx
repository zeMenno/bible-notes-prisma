import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FeatureGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
