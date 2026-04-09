import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { VerseCallout } from "@/components/site/verse-callout";
import { siteDescription, siteName } from "@/lib/site-meta";
import { cn } from "@/lib/utils";

const title = "Pricing";

export const metadata: Metadata = {
  title,
  description: `${siteName} is free. ${siteDescription}`,
  openGraph: {
    title: `${title} · ${siteName}`,
    description: `Every feature listed here is included at no cost.`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · ${siteName}`,
    description: `Every feature listed here is included at no cost.`,
  },
};

const freeFeatures = [
  "Email and password account with secure password hashing",
  "Top app navigation after sign in: Notes, Dashboard, Note graph, and New note",
  "Create, list, open, autosave, and delete your notes",
  "Rich text: headings, lists, task lists, blockquote, code block, horizontal rule",
  "Marks: bold, italic, strikethrough, code, underline, highlight, super and subscript",
  "Typography helpers, hyperlinks, text alignment, undo and redo",
  "Image upload control (demo uses a placeholder image file)",
  "Editor light and dark toggle plus responsive toolbar",
  "Bible passage insert and replace through YouVersion Platform",
  "Structured passage blocks with USFM, reference, and translation metadata",
  "Highlight and emphasize inside passages without changing verse characters",
  "Automatic migration for older passage and blockquote shapes on load",
  "Standalone /simple route to try the editor without saving notes",
];

export default function PricingPage() {
  return (
    <>
      <Section className="border-b border-border/50 pt-12 sm:pt-16">
        <PageHero
          kicker="Pricing"
          title="Free for everyone who loves Scripture."
          description="Taking notes alongside God’s Word should not depend on a subscription. This page lists every capability you receive today, all included in the free plan."
        >
          <Link
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Start free
          </Link>
        </PageHero>
      </Section>

      <Section bordered>
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary">Bible Notes</p>
                <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight">
                  Free
                </h2>
              </div>
              <p className="text-right text-sm text-muted-foreground">
                No credit card
                <br />
                No trial countdown
              </p>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              One plan. Every feature we ship today is yours.
            </p>
            <ul className="mt-8 space-y-3">
              {freeFeatures.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <Check
                    className={cn(
                      "mt-0.5 size-4 shrink-0 text-primary",
                    )}
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-10 flex h-11 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Create your free account
            </Link>
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl">
          <VerseCallout
            quote="And God is able to make all grace abound to you, that you, always having all sufficiency in everything, may abound to every good work."
            reference="2 Corinthians 9:8"
          />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            We believe generosity in ministry starts with access. If you outgrow what
            we offer, you can still export ideas manually from your notes anytime by
            copying content from the editor.
          </p>
        </div>
      </Section>
    </>
  );
}
