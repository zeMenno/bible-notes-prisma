import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bible Notes",
  description: "Maak en bewaar je bijbelnotities op één plek.",
};

const navItems = [
  { label: "Functies", href: "#functies" },
  { label: "Editor", href: "#editor" },
  { label: "Voor wie", href: "#voor-wie" },
];

const featureList = [
  { id: "refs", label: "Bijbelverwijzingen", active: true },
  { id: "rich", label: "Rijke tekst", active: false },
  { id: "cloud", label: "Altijd beschikbaar", active: false },
];

const trustLabels = ["Studie", "Gemeente", "Persoonlijk", "Onderwijs", "Research"];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span
              className="size-2.5 rounded-sm bg-primary shadow-[0_0_12px_color-mix(in_oklch,var(--primary)_60%,transparent)]"
              aria-hidden
            />
            <span className="font-heading text-sm font-semibold tracking-tight sm:text-base">
              Bible Notes
            </span>
          </Link>

          <nav
            className="hidden md:flex items-center gap-1 text-sm text-muted-foreground"
            aria-label="Hoofdnavigatie"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-0.5 rounded-md px-3 py-2 transition-colors hover:text-foreground"
              >
                {item.label}
                <ChevronDown className="size-3.5 opacity-50" aria-hidden />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-4"
            >
              Inloggen
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:h-10 sm:px-5"
            >
              Account aanmaken
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border/50">
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

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Persoonlijke studie
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Bijbelnotities die meegroeien met je denken.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Koppel verzen, schrijf rijke notities en pak later precies de draad weer op—zonder
            rommel in losse documenten.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Aan de slag
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-transparent px-8 text-sm font-semibold transition-colors hover:bg-muted/50"
            >
              Inloggen
            </Link>
          </div>
        </div>
      </section>

      <section
        id="voor-wie"
        className="scroll-mt-20 border-b border-border/50 py-10 sm:py-12"
        aria-label="Voor wie"
      >
        <p className="mx-auto max-w-6xl px-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground sm:px-6">
          Geschikt voor elke manier van lezen
        </p>
        <div className="mx-auto mt-6 flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 opacity-40 grayscale sm:px-6">
          {trustLabels.map((label) => (
            <span
              key={label}
              className="font-heading text-sm font-semibold tracking-wide sm:text-base"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      <section id="functies" className="scroll-mt-20 border-b border-border/50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,11rem)_1fr] lg:gap-16">
          <div className="flex flex-row gap-6 lg:flex-col lg:gap-1" role="list">
            {featureList.map((f) => (
              <div
                key={f.id}
                role="listitem"
                className={cn(
                  "flex items-center gap-2.5 text-sm transition-colors lg:py-2",
                  f.active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    f.active ? "bg-primary shadow-[0_0_8px_color-mix(in_oklch,var(--primary)_70%,transparent)]" : "bg-border",
                  )}
                  aria-hidden
                />
                {f.label}
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Notities voor de AI- en lees-era.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Eén editor, duidelijke structuur: verwijs naar Schrift, markeer passages en werk verder
              waar je gebleven was.
            </p>

            <div
              id="editor"
              className="mt-10 scroll-mt-24 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border/80 bg-muted/30 px-4 py-3">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
                <span className="size-2.5 rounded-full bg-[#febc2e]" aria-hidden />
                <span className="size-2.5 rounded-full bg-[#28c840]" aria-hidden />
                <span className="ml-3 font-mono text-xs text-muted-foreground">studie — Genesis 1:1.md</span>
              </div>
              <div className="grid gap-0 md:grid-cols-[1fr_minmax(0,14rem)]">
                <div className="border-b border-border/80 p-4 font-mono text-xs leading-relaxed text-muted-foreground md:border-b-0 md:border-r md:border-border/80">
                  <p>
                    <span className="text-primary">@</span>{" "}
                    <span className="text-foreground/90">Gen 1:1</span> — In den beginne schiep God
                    de hemel en de aarde.
                  </p>
                  <p className="mt-3 text-foreground/80">
                    • Licht vs duisternis: orde en scheiding als thema voor deze week.
                  </p>
                  <p className="mt-2 text-foreground/80">
                    • Kruisverwijzing: Joh 1:1–5 (Logos, licht).
                  </p>
                </div>
                <div className="bg-muted/20 p-4">
                  <p className="text-xs font-medium text-foreground">Volgende stappen</p>
                  <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <li className="flex gap-2">
                      <BookOpen className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                      Lees verder Gen 1:2–5
                    </li>
                    <li>• Vat samen in één zin</li>
                    <li>• Deel met je groep (binnenkort)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-border/50 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Bible Notes</span>
          <div className="flex gap-6">
            <Link href="/login" className="transition-colors hover:text-foreground">
              Inloggen
            </Link>
            <Link href="/register" className="transition-colors hover:text-foreground">
              Registreren
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
