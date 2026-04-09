import Link from "next/link";

import { footerNavColumns } from "@/lib/site-nav";
import { siteName } from "@/lib/site-meta";

import { Container } from "./container";
import { SiteBrandLink } from "./site-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/50 py-12 sm:py-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <SiteBrandLink href="/" className="w-fit" logoSize={28} />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Scripture quotations on this site marked WEB are from the World
              English Bible, public domain.
            </p>
          </div>
          {footerNavColumns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} {siteName}</span>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-foreground">
              Log in
            </Link>
            <Link href="/register" className="hover:text-foreground">
              Register
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
