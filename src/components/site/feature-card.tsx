import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FeatureCard({
  href,
  title,
  description,
  className,
  footer,
}: {
  href: string;
  title: string;
  description: string;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40 hover:bg-card/80 sm:p-7",
        className,
      )}
    >
      <h3 className="font-heading text-lg font-semibold tracking-tight group-hover:text-primary">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {footer ? (
        <div className="mt-4 text-sm font-medium text-primary">{footer}</div>
      ) : (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Learn more
          <span aria-hidden>→</span>
        </span>
      )}
    </Link>
  );
}
