"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

import { featureNavLinks } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

import { BetaBadge } from "./beta-badge";
import { Container } from "./container";
import { SiteBrandLink } from "./site-logo";

const navLinkClass =
  "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-4">
        <SiteBrandLink href="/" />

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger
              className={cn(
                navLinkClass,
                "inline-flex items-center gap-0.5 outline-none data-[state=open]:text-foreground",
              )}
            >
              Features
              <ChevronDown className="size-3.5 opacity-50" aria-hidden />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-[16rem] rounded-lg border border-border bg-popover p-1 shadow-lg"
                sideOffset={6}
                align="start"
              >
                {featureNavLinks.map((item) => (
                  <DropdownMenu.Item key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="block rounded-md px-3 py-2.5 text-sm outline-none data-[highlighted]:bg-muted"
                    >
                      <span className="flex flex-wrap items-center gap-2 font-medium text-foreground">
                        {item.label}
                        {item.badge ? <BetaBadge /> : null}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <Link href="/pricing" className={navLinkClass}>
            Pricing
          </Link>
          <Link href="/blog" className={navLinkClass}>
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex sm:px-4"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:h-10 sm:px-5"
          >
            Start free
          </Link>

          <details className="relative md:hidden">
            <summary
              className="flex cursor-pointer list-none items-center justify-center rounded-md border border-border p-2 text-muted-foreground [&::-webkit-details-marker]:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-popover py-2 shadow-lg">
              <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Features
              </p>
              {featureNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  {item.label}
                  {item.badge ? <BetaBadge /> : null}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              <Link
                href="/pricing"
                className="block px-3 py-2 text-sm hover:bg-muted"
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 text-sm hover:bg-muted"
              >
                Blog
              </Link>
              <Link
                href="/login"
                className="block px-3 py-2 text-sm hover:bg-muted"
              >
                Log in
              </Link>
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
