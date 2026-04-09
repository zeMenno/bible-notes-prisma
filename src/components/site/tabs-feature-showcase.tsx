"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export type ShowcaseTab = {
  id: string;
  label: string;
  headline: string;
  body: string;
  bullets: string[];
};

export function TabsFeatureShowcase({ tabs }: { tabs: ShowcaseTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  if (!active) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Study focus"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === active.id}
            onClick={() => setActiveId(tab.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              tab.id === active.id
                ? "border-primary text-foreground"
                : "border-border text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        aria-labelledby={active.id}
        className="rounded-xl border border-border bg-card/50 p-6 sm:p-8"
      >
        <h3 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
          {active.headline}
        </h3>
        <p className="mt-3 text-muted-foreground">{active.body}</p>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          {active.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-primary" aria-hidden>
                •
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
