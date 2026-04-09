import Image from "next/image";
import Link from "next/link";

import { siteLogoPath, siteName } from "@/lib/site-meta";
import { cn } from "@/lib/utils";

export function SiteLogoMark({
  className,
  size = 32,
}: {
  className?: string;
  /** Rendered width and height in pixels. */
  size?: number;
}) {
  return (
    <Image
      src={siteLogoPath}
      alt=""
      width={size}
      height={size}
      unoptimized
      className={cn("shrink-0 object-contain", className)}
      aria-hidden
    />
  );
}

type SiteBrandLinkProps = {
  href: string;
  className?: string;
  logoSize?: number;
  /** When set, used as the link accessible name (visible title stays for sighted users). */
  ariaLabel?: string;
};

export function SiteBrandLink({
  href,
  className,
  logoSize = 28,
  ariaLabel,
}: SiteBrandLinkProps) {
  return (
    <Link
      href={href}
      className={cn("flex shrink-0 items-center gap-2.5", className)}
      aria-label={ariaLabel}
    >
      <SiteLogoMark size={logoSize} className="rounded-sm" />
      <span className="font-heading text-sm font-semibold tracking-tight sm:text-base">
        {siteName}
      </span>
    </Link>
  );
}
