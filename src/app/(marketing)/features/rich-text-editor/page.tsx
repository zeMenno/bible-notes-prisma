import Link from "next/link";
import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { VerseCallout } from "@/components/site/verse-callout";
import { siteName } from "@/lib/site-meta";

const title = "Rich text editor";
const description =
  "Format study notes with headings, lists, highlights, links, images, alignment, and undo. The same Tiptap toolbar powers every note you save.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title: `${title} · ${siteName}`, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function RichTextEditorPage() {
  return (
    <>
      <Section className="border-b border-border/50 pt-12 sm:pt-16">
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
              href="/simple"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border px-8 text-sm font-semibold transition-colors hover:bg-muted/50"
            >
              Open toolbar demo
            </Link>
          </div>
        </PageHero>
      </Section>

      <Section bordered>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Built-in formatting
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>Headings, bullet lists, ordered lists, and task lists</li>
              <li>Blockquote, fenced code block, horizontal rule</li>
              <li>Bold, italic, strikethrough, inline code, underline</li>
              <li>Multi-color highlight, superscript, subscript</li>
              <li>Typography helpers (smart punctuation)</li>
              <li>Hyperlinks with the link popover</li>
              <li>Text alignment (left, center, right, justify)</li>
              <li>Undo and redo</li>
              <li>
                Image button with upload UI (demo resolves to a placeholder image
                asset)
              </li>
              <li>Dark and light toggle in the editor chrome</li>
              <li>Responsive toolbar with mobile sheets for some tools</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Scripture blocks use the same surface but gate plain-text edits. See{" "}
              <Link
                href="/features/scripture-in-notes"
                className="text-primary hover:underline"
              >
                Scripture in notes
              </Link>{" "}
              for that behavior.
            </p>
          </div>
          <VerseCallout
            quote="Let the word of Christ dwell in you richly; in all wisdom teaching and admonishing one another with psalms, hymns, and spiritual songs, singing with grace in your heart to the Lord."
            reference="Colossians 3:16"
          />
        </div>
      </Section>

      <Section>
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/features/notes-and-accounts"
            className="text-primary hover:underline"
          >
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
