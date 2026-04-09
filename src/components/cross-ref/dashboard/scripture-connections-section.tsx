import type {
  CrossRefDashboardStats,
  CrossRefTopPassageRow,
  CrossRefTrendPoint,
} from "../types"
import {
  CrossRefScriptureActivityTrendChart,
  CrossRefTopPassagesChart,
} from "./cross-ref-dashboard-charts"
import { CrossRefStatsCards } from "./cross-ref-stats-cards"

type Props = {
  stats: CrossRefDashboardStats
  topPassages: CrossRefTopPassageRow[]
  trend: CrossRefTrendPoint[]
}

export function ScriptureConnectionsSection({
  stats,
  topPassages,
  trend,
}: Props) {
  return (
    <section className="mt-10 space-y-4" aria-labelledby="scripture-connections-heading">
      <div>
        <h2
          id="scripture-connections-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Scripture connections
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Counts and charts from your saved notes (same rules as cross-references in the
          editor).
        </p>
      </div>

      <CrossRefStatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
          <CrossRefTopPassagesChart rows={topPassages} />
        </div>
        <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
          <CrossRefScriptureActivityTrendChart points={trend} />
        </div>
      </div>
    </section>
  )
}
