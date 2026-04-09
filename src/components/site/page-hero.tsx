import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHero({
  kicker,
  title,
  description,
  className,
  children,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  description?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {kicker ? (
        <div className="text-xs font-medium uppercase tracking-widest text-primary">
          {kicker}
        </div>
      ) : null}
      <h1
        className={cn(
          "text-balance font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl",
          kicker && "mt-4",
        )}
      >
        {title}
      </h1>
      {description ? (
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-10">{children}</div> : null}
    </div>
  );
}
