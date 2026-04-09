import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { Container } from "@/components/site/container";
import { FeatureCard } from "@/components/site/feature-card";
import { FeatureGrid } from "@/components/site/feature-grid";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import {
  TabsFeatureShowcase,
  type ShowcaseTab,
} from "@/components/site/tabs-feature-showcase";
import { PwaHomeInstallBlockLazy } from "@/components/site/pwa-install-lazy";
import { MarketingBlobBackdrop } from "@/components/site/marketing-blobs";
import { VerseCallout } from "@/components/site/verse-callout";
import { featureNavLinks } from "@/lib/site-nav";
import { siteDescription, siteName } from "@/lib/site-meta";

export const metadata: Metadata = {
  title: "Home",
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

const useCaseChips = [
  "Personal Bible study",
  "Sermon preparation",
  "Small group lesson prep",
  "Theology coursework",
  "Journaling with Scripture",
];

const showcaseTabs: ShowcaseTab[] = [
  {
    id: "personal",
    label: "Personal study",
    headline: "Keep one calm place for Scripture and reflection",
    body: "Create notes, insert the passage you are reading, and add your own paragraphs underneath. Everything saves to your account.",
    bullets: [
      "Insert passage text through the Bible picker (YouVersion Platform).",
      "Highlight and emphasize words inside a passage without changing the underlying verse text.",
      "Use headings and lists to outline what stands out.",
    ],
  },
  {
    id: "sermon",
    label: "Sermon prep",
    headline: "Anchor outlines next to the verses you preach",
    body: "Structure main ideas with the rich text editor while keeping the quoted text tied to book, chapter, and verse metadata.",
    bullets: [
      "Structured passage blocks store USFM, human-readable reference, and translation info on the node.",
      "Replace a passage deliberately when you change translation or range (whole block update).",
      "Task lists help you track illustrations, applications, and calls to action.",
    ],
  },
  {
    id: "group",
    label: "Group prep",
    headline: "Prepare discussion notes before you meet",
    body: "Draft questions and observations in your own workspace. Sharing notes with others is not built in yet, but you can study and organize privately today.",
    bullets: [
      "Autosave reduces the risk of losing a long study session.",
      "Link related verses or articles with normal hyperlinks in the editor.",
      "Delete notes you no longer need from your notes list.",
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-40 left-1/2 h-[min(28rem,50vh)] w-[min(100%,80rem)] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.12] dark:opacity-[0.18]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 52px,
                oklch(0.988 0.003 106.5 / 0.07) 52px,
                oklch(0.988 0.003 106.5 / 0.07) 53px
              )`,
            }}
          />
        </div>

        <Container className="relative py-20 sm:py-28 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
            <PageHero
              kicker="Scripture first notes"
              title={
                <>
                  Write study notes that stay tied to{" "}
                  <span className="text-primary">God&apos;s Word</span>.
                </>
              }
              description="A focused editor for believers: insert passages, mark up what matters, and return later without losing context. Free to use."
            >
              <div className="flex flex-col gap-3 sm:items-start">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href="/register"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Start free
                  </Link>
                  <Link
                    href="/simple"
                    className="inline-flex h-11 items-center justify-center rounded-full border-2 border-primary bg-primary/10 px-8 text-sm font-semibold text-foreground transition-colors hover:bg-primary/15"
                  >
                    Try live demo
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </PageHero>
            <VerseCallout
              quote="This book of the law shall not depart from your mouth, but you shall meditate on it day and night, that you may observe to do according to all that is written in it; for then you shall make your way prosperous, and then you shall have good success."
              reference="Joshua 1:8"
            />
          </div>
        </Container>
      </section>

      <Section
        aria-label="Try the editor demo"
        className="py-10 sm:py-12"
        marketingBlobSeed="home-demo"
        withMarketingBlobs
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 via-muted/40 to-muted/20 p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-10">
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Hands on
            </p>
            <h2 className="mt-2 text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Try the <span className="text-primary">editor</span> before you sign
              up
            </h2>
            <p className="mt-3 text-muted-foreground sm:text-lg">
              Open the live demo to use the full toolbar, insert Scripture, and
              explore formatting. Nothing is saved until you create an account.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
            <Link
              href="/simple"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-primary bg-primary/10 px-8 text-sm font-semibold text-foreground transition-colors hover:bg-primary/15"
            >
              Open live demo
            </Link>
          </div>
        </div>
      </Section>

      
      <Section
        aria-label="Ways to use Bible Notes"
        className="py-10 sm:py-12"
        marketingBlobSeed="home-use-cases"
        
      >
        <p className="text-center text-balance text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Fit the way you <span className="text-primary">study</span> today
        </p>
        <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2 sm:gap-3">
          {useCaseChips.map((label) => (
            <span
              key={label}
              className="rounded-full border border-border/80 bg-muted/30 px-4 py-2 text-sm text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      </Section>



      <Section
        aria-label="Install as an app"
        className="py-10 sm:py-12"
        marketingBlobSeed="home-install-app"
        withMarketingBlobs
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl border border-border/80 bg-muted/15 p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-10">
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Install
            </p>
            <h2 className="mt-2 text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Add Bible Notes to your{" "}
              <span className="text-primary">Home Screen</span>
            </h2>
            <p className="mt-3 text-muted-foreground sm:text-lg">
              This site is a progressive web app: you can install it like a
              focused shortcut that opens full screen, without an app store. On
              many phones and desktops the browser can show a one-tap install
              prompt when criteria are met.
            </p>
            <Link
              href="/blog/install-pwa-home-screen"
              className="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Read the install guide
              <span aria-hidden className="ml-1">
                →
              </span>
            </Link>
          </div>
          <div className="flex min-w-0 shrink-0 flex-col items-stretch gap-3 sm:max-w-xs sm:items-end">
            <PwaHomeInstallBlockLazy />
          </div>
        </div>
      </Section>


      <Section
        id="features"
        marketingBlobSeed="home-features"
        
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Everything in one <span className="text-primary">honest</span>{" "}
            workflow
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Pick a topic to read what the app actually does, with no borrowed{" "}
            <span className="text-destructive">hype</span> from other products.
          </p>
        </div>
        <FeatureGrid className="mt-12">
          {featureNavLinks.map((f) => (
            <FeatureCard
              key={f.href}
              href={f.href}
              title={f.label}
              description={f.description}
              badge={f.badge}
            />
          ))}
        </FeatureGrid>
      </Section>

      <Section
        className="bg-muted/20"
        marketingBlobSeed="home-rhythms"
        withMarketingBlobs
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Same <span className="text-primary">tools</span>,{" "}
            <span className="text-primary">different rhythms</span>
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Tap a focus to see how existing features support that habit.
          </p>
        </div>
        <div className="mt-12">
          <TabsFeatureShowcase tabs={showcaseTabs} />
        </div>
      </Section>
      <Section
        aria-label="Note graph beta"
        className="py-10 sm:py-12"
        marketingBlobSeed="home-graph"
        
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl border border-border/80 bg-muted/15 p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-10">
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Beta
            </p>
            <h2 className="mt-2 text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Map how your notes connect through{" "}
              <span className="text-primary">Scripture</span>
            </h2>
            <p className="mt-3 text-balance text-muted-foreground sm:text-lg">
              After you sign in, open the note graph to explore your library visually.
              Each note is a point; lines appear when two notes share matching passage
              metadata (
              <span className="text-destructive">not</span> wiki-style links).
              Layout and filters are still evolving.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
              <Link
                href="/features/note-graph"
                className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Read the feature overview
                <span aria-hidden className="ml-1">
                  →
                </span>
              </Link>
              <Link
                href="/blog/note-graph-beta"
                className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Blog: what ships today
                <span aria-hidden className="ml-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="editor"
        marketingBlobSeed="home-editor-app"
        withMarketingBlobs
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <h2 className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Editor that respects{" "}
              <span className="text-primary">Scripture</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Passage text lives in a dedicated block: you can emphasize words, but
              ordinary typing cannot silently change verse wording. Updating a passage
              uses the Bible picker so references stay accurate.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden>
                  •
                </span>
                Older blockquote inserts still open thanks to migration on load.
              </li>
              <li className="flex gap-2">
                <span className="text-primary" aria-hidden>
                  •
                </span>
                The{" "}
                <Link href="/simple" className="text-primary hover:underline">
                  live demo
                </Link>{" "}
                uses the same editor without saving.
              </li>
            </ul>
          </div>

          <div
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            aria-label="Editor preview illustration"
          >
            <div className="flex items-center gap-2 border-b border-border/80 bg-muted/30 px-4 py-3">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
              <span className="size-2.5 rounded-full bg-[#febc2e]" aria-hidden />
              <span className="size-2.5 rounded-full bg-[#28c840]" aria-hidden />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                study · Genesis 1:1
              </span>
            </div>
            <div className="grid gap-0 md:grid-cols-[1fr_minmax(0,12rem)]">
              <div className="border-b border-border/80 p-4 font-mono text-xs leading-relaxed text-muted-foreground md:border-b-0 md:border-r md:border-border/80">
                <p className="rounded-md border border-primary/30 bg-primary/5 p-3 text-foreground/90">
                  <span className="text-primary">Passage · </span>
                  Genesis 1:1 (WEB)
                  <br />
                  <span className="mt-2 block text-foreground/85">
                    In the beginning, God created the heavens and the earth.
                  </span>
                </p>
                <p className="mt-3 text-foreground/80">
                  • God&apos;s speech creates: light, sky, land, life (Gen 1).
                </p>
                <p className="mt-2 text-foreground/80">
                  • Cross reference: John 1:1–5 (Word and light).
                </p>
              </div>
              <div className="bg-muted/20 p-4">
                <p className="text-xs font-medium text-foreground">Next steps</p>
                <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <li className="flex gap-2">
                    <BookOpen className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                    Read Genesis 1:2–5
                  </li>
                  <li>• Write a one sentence summary</li>
                  <li>• Add tasks for deeper word study</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <section className="relative overflow-visible bg-[oklch(0.13_0.022_38)] py-20 sm:py-24">
        <MarketingBlobBackdrop seed="home-paywall" />
        <Container className="relative z-10 text-center">
          <h2 className="mx-auto max-w-2xl text-balance font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your notes belong with{" "}
            <span className="text-primary">Scripture</span>, not behind a{" "}
            <span className="text-red-300">paywall</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
            We keep the product free so anyone can meditate, learn, and obey without
            a subscription barrier.
          </p>
          <VerseCallout
            className="mx-auto mt-10 max-w-xl border-white/10 bg-white/5 text-left text-white [&_blockquote]:text-white [&_figcaption]:text-white/60"
            quote="Freely you received, so freely give."
            reference="Matthew 10:8"
          />
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Create a free account
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              See pricing details
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
