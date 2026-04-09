import Link from "next/link";
import type { Metadata } from "next";

import { BetaBadge } from "@/components/site/beta-badge";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { VerseCallout } from "@/components/site/verse-callout";
import { siteName } from "@/lib/site-meta";

const title = "Note graph";
const description =
  "Beta: explore your signed-in notes as an interactive graph. Nodes are notes; edges appear when two notes share matching scripture inserts (same rules as the cross-reference panel).";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title: `${title} · ${siteName}`, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function NoteGraphFeaturePage() {
  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <PageHero
          kicker={
            <span className="inline-flex flex-wrap items-center gap-2">
              <span>Features</span>
              <BetaBadge />
            </span>
          }
          title={title}
          description={description}
        >
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Create account
            </Link>
            <Link
              href="/blog/note-graph-beta"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border px-8 text-sm font-semibold transition-colors hover:bg-muted/50"
            >
              Read the blog post
            </Link>
          </div>
        </PageHero>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              What you get today
            </h2>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <strong className="text-foreground">Where to open it: </strong>
                After you log in, open{" "}
                <strong className="text-foreground">Note graph</strong> from the top app bar
                (next to Notes and Dashboard).
              </li>
              <li>
                <strong className="text-foreground">What links mean: </strong>
                A line between two notes means at least one passage in each note matches
                the other under the same rules as scripture cross-references (including
                USFM overlap where available). This is not Obsidian-style{" "}
                <code className="text-foreground">[[wiki]]</code> linking.
              </li>
              <li>
                <strong className="text-foreground">Controls: </strong>
                Search by title, filter by minimum link strength, click to select a
                note, use Focus neighborhood for a local view (depth in hops), zoom
                and pan, double-click to open a note.
              </li>
              <li>
                <strong className="text-foreground">Beta expectations: </strong>
                Layout and performance are best suited to personal libraries today. Large
                collections use the same full-scan approach as other scripture features,
                so we label this beta while we learn how people use it.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Privacy is unchanged: the graph API only returns your own notes for the
              signed-in session.
            </p>
          </div>
          <VerseCallout
            quote="I will meditate on your precepts, and consider your ways."
            reference="Psalm 119:15"
          />
        </div>
      </Section>

      <Section>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/features/scripture-in-notes" className="text-primary hover:underline">
            Scripture in notes
          </Link>
          {" · "}
          <Link href="/features/notes-and-accounts" className="text-primary hover:underline">
            Notes and accounts
          </Link>
          {" · "}
          <Link href="/pricing" className="text-primary hover:underline">
            Pricing
          </Link>
        </p>
      </Section>
    </>
  );
}
