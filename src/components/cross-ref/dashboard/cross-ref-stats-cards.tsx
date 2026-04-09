import type { CrossRefDashboardStats } from "../types"

type Props = {
  stats: CrossRefDashboardStats
}

export function CrossRefStatsCards({ stats }: Props) {
  const items: { label: string; value: number; hint: string }[] = [
    {
      label: "Notes with scripture",
      value: stats.notesWithScripture,
      hint: "Notes that contain at least one passage block.",
    },
    {
      label: "Passage instances",
      value: stats.passageInstances,
      hint: "Total scripture blocks across all notes.",
    },
    {
      label: "Linked by shared passages",
      value: stats.notesLinkedBySharedPassages,
      hint: "Notes that share a passage with at least one other note.",
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          title={item.hint}
        >
          <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
            {item.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}
