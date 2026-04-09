import Link from "next/link";
import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { VerseCallout } from "@/components/site/verse-callout";
import { siteName } from "@/lib/site-meta";

const title = "Notes and accounts";
const description =
  "Sign up with email and password, open your notes from the top navigation, create notes, autosave edits, and delete what you no longer need. Your content stays tied to your login.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title: `${title} · ${siteName}`, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function NotesAndAccountsPage() {
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
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border px-8 text-sm font-semibold transition-colors hover:bg-muted/50"
            >
              Log in
            </Link>
          </div>
        </PageHero>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              How it works
            </h2>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <strong className="text-foreground">Registration: </strong>
                Passwords are hashed before storage. Minimum length is enforced on the
                server.
              </li>
              <li>
                <strong className="text-foreground">Session: </strong>
                NextAuth issues a JWT session for credential sign-in so you stay
                signed in across visits according to your cookie settings.
              </li>
              <li>
                <strong className="text-foreground">Dashboard: </strong>
                After login you land on a simple home that links into your notes.
              </li>
              <li>
                <strong className="text-foreground">Notes list: </strong>
                See every note for your user, start a new blank note, or remove notes
                with confirmation.
              </li>
              <li>
                <strong className="text-foreground">Editor autosave: </strong>
                Title and editor JSON save on a throttle to your note record through
                the authenticated API.
              </li>
              <li>
                <strong className="text-foreground">Privacy boundary: </strong>
                APIs check the signed-in user before reading or writing note rows in
                Postgres through Prisma.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Details on cookies and data categories live in{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy
              </Link>
              .
            </p>
          </div>
          <VerseCallout
            quote="Commit your deeds to Yahweh, and your plans shall succeed."
            reference="Proverbs 16:3"
          />
        </div>
      </Section>

      <Section>
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/features/scripture-in-notes"
            className="text-primary hover:underline"
          >
            Scripture in notes
          </Link>
          {" · "}
          <Link
            href="/features/rich-text-editor"
            className="text-primary hover:underline"
          >
            Rich text editor
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
