import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Container } from "./container";
import { MarketingBlobBackdrop } from "./marketing-blobs";

export function Section({
  id,
  className,
  containerClassName,
  children,
  "aria-label": ariaLabel,
  withMarketingBlobs,
  marketingBlobSeed,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  "aria-label"?: string;
  withMarketingBlobs?: boolean;
  /** Unique per section so blob layout varies; defaults from id or aria-label. */
  marketingBlobSeed?: string;
}) {
  const blobSeed =
    marketingBlobSeed ?? id ?? ariaLabel ?? "marketing-section";

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        withMarketingBlobs && "relative overflow-visible",
        className,
      )}
    >
      {withMarketingBlobs ? (
        <MarketingBlobBackdrop seed={blobSeed} />
      ) : null}
      <Container
        className={cn(withMarketingBlobs && "relative z-10", containerClassName)}
      >
        {children}
      </Container>
    </section>
  );
}
