import type { DashboardVerseOfTheDay } from "@/lib/youversion-verse-of-the-day";

export type DashboardWelcomeCardProps = {
  displayName: string;
  verse: DashboardVerseOfTheDay | null;
};

export function DashboardWelcomeCard({
  displayName,
  verse,
}: DashboardWelcomeCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Welcome, {displayName}.</p>

      {verse ? (
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Verse of the day
          </p>
          <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
            {verse.text}
          </blockquote>
          <p className="mt-3 text-xs text-muted-foreground">
            {verse.reference} ({verse.versionTitle}). Scripture courtesy of YouVersion.
          </p>
        </div>
      ) : null}
    </div>
  );
}
