"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { BetaBadge } from "@/components/site/beta-badge";
import { Container } from "@/components/site/container";
import { appNavItems, isAppNavActive } from "@/lib/app-nav";
import { siteName } from "@/lib/site-meta";
import { cn } from "@/lib/utils";

const navLinkClass =
  "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground";

export type AppHeaderProps = {
  userEmail: string | null;
};

export function AppHeader({ userEmail }: AppHeaderProps) {
  const pathname = usePathname() ?? "";

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3 md:gap-6">
          <Link
            href="/notes"
            className="flex shrink-0 items-center gap-2.5"
            aria-label={`${siteName}, go to notes`}
          >
            <span
              className="size-2.5 rounded-sm bg-primary shadow-[0_0_12px_color-mix(in_oklch,var(--primary)_60%,transparent)]"
              aria-hidden
            />
            <span className="font-heading text-sm font-semibold tracking-tight sm:text-base">
              {siteName}
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="App navigation"
          >
            {appNavItems.map((item) => {
              const active = isAppNavActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    navLinkClass,
                    "inline-flex items-center gap-2",
                    active && "bg-muted/80 text-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  {item.showBetaBadge ? <BetaBadge /> : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link
            href="/notes/new"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:h-10 sm:px-5"
          >
            New note
          </Link>

          {userEmail ? (
            <SignOutButton className="hidden h-9 shrink-0 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium md:inline-flex">
              Sign out
            </SignOutButton>
          ) : (
            <Link
              href="/login"
              className="hidden text-sm font-medium text-muted-foreground hover:text-foreground md:inline"
            >
              Sign in
            </Link>
          )}

          <details className="relative md:hidden">
            <summary
              className="flex cursor-pointer list-none items-center justify-center rounded-md border border-border p-2 text-muted-foreground [&::-webkit-details-marker]:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-popover py-2 shadow-lg">
              {appNavItems.map((item) => {
                const active = isAppNavActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-muted",
                      active && "bg-muted/80 font-medium text-foreground",
                    )}
                  >
                    {item.label}
                    {item.showBetaBadge ? <BetaBadge /> : null}
                  </Link>
                );
              })}
              <div className="my-2 border-t border-border" />
              {userEmail ? (
                <>
                  <p className="px-3 pb-1 text-xs text-muted-foreground">{userEmail}</p>
                  <SignOutButton className="w-full px-3 py-2 text-left text-sm hover:bg-muted">
                    Sign out
                  </SignOutButton>
                </>
              ) : (
                <Link href="/login" className="block px-3 py-2 text-sm hover:bg-muted">
                  Sign in
                </Link>
              )}
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
