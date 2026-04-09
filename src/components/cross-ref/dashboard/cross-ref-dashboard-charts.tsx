"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { CrossRefTopPassageRow, CrossRefTrendPoint } from "../types"

type TopProps = {
  rows: CrossRefTopPassageRow[]
  className?: string
}

export function CrossRefTopPassagesChart({ rows, className }: TopProps) {
  return (
    <div className={className}>
      <p className="mb-1 text-sm font-medium text-foreground">Top passages</p>
      <p className="mb-3 text-xs text-muted-foreground">
        Number of notes that include each passage (by reference or USFM).
      </p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No scripture blocks in your notes yet.</p>
      ) : (
        <div className="h-[min(20rem,55vh)] w-full min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                interval={0}
                angle={-28}
                textAnchor="end"
                height={72}
              />
              <YAxis
                width={36}
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  color: "var(--popover-foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 12,
                }}
                formatter={(value) => [
                  typeof value === "number"
                    ? value.toLocaleString()
                    : value != null
                      ? String(value)
                      : "—",
                  "Notes",
                ]}
              />
              <Bar
                dataKey="count"
                name="Notes"
                fill="var(--chart-2)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

type TrendProps = {
  points: CrossRefTrendPoint[]
  className?: string
}

export function CrossRefScriptureActivityTrendChart({ points, className }: TrendProps) {
  return (
    <div className={className}>
      <p className="mb-1 text-sm font-medium text-foreground">Scripture note activity</p>
      <p className="mb-3 text-xs text-muted-foreground">
        Notes that contain scripture and were saved in each UTC week (last eight weeks).
      </p>
      <div className="h-[min(16rem,45vh)] w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              width={36}
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: 12,
              }}
              formatter={(value) => [
                typeof value === "number"
                  ? value.toLocaleString()
                  : value != null
                    ? String(value)
                    : "—",
                "Notes",
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--chart-3)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
