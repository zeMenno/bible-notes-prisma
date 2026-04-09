import Link from "next/link";
import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { VerseCallout } from "@/components/site/verse-callout";
import { siteName } from "@/lib/site-meta";

const title = "Scripture in your notes";
const description =
  "Insert Bible text through YouVersion, store reference metadata on each passage block, and keep verse wording stable while you highlight and reflect.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title: `${title} · ${siteName}`, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function ScriptureInNotesPage() {
  return (
    <>
      <Section className="pt-12 sm:pt-16">
        <PageHero
          kicker="Features"
          title={title}
          description={description}
        >
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Start free
            </Link>
            <Link
              href="/features/rich-text-editor"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border px-8 text-sm font-semibold transition-colors hover:bg-muted/50"
            >
              Rich text editor
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
                <strong className="text-foreground">Bible picker: </strong>
                The editor uses the YouVersion Platform UI to fetch passage text for
                the range and translation you choose.
              </li>
              <li>
                <strong className="text-foreground">Structured block: </strong>
                Each insert becomes a{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-sm">
                  biblePassage
                </code>{" "}
                node. Attributes hold USFM, display reference, version id, and version
                title for reliable cross-reference style workflows later.
              </li>
              <li>
                <strong className="text-foreground">Locked wording: </strong>
                A ProseMirror filter rejects edits that would change the flattened
                plain text inside an existing passage. You may still delete the whole
                block.
              </li>
              <li>
                <strong className="text-foreground">Marks: </strong>
                Bold, underline, highlight, and similar marks can apply inside the
                passage paragraphs so emphasis stays on the page without altering
                characters.
              </li>
              <li>
                <strong className="text-foreground">Deliberate replace: </strong>
                Changing translation or verse range refetches through the dedicated
                replace command so updates are intentional, not accidental keystrokes.
              </li>
              <li>
                <strong className="text-foreground">Legacy content: </strong>
                Older blockquote inserts and earlier shapes normalize when a note
                loads so you are not stuck with broken structure.
              </li>
            </ul>
          </div>
          <VerseCallout
            quote="Your word is a lamp to my feet, and a light for my path."
            reference="Psalm 119:105"
          />
        </div>
      </Section>

      <Section>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/features/notes-and-accounts" className="text-primary hover:underline">
            Notes and accounts
          </Link>
          {" · "}
          <Link href="/features/note-graph" className="text-primary hover:underline">
            Note graph (beta)
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
