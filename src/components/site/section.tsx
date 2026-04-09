import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Container } from "./container";

export function Section({
  id,
  bordered,
  className,
  containerClassName,
  children,
  "aria-label": ariaLabel,
}: {
  id?: string;
  bordered?: boolean;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        bordered && "border-b border-border/50",
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
