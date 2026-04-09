import type { JSONContent } from "@tiptap/core"

import type {
  CrossRefDashboardStats,
  CrossRefTopPassageRow,
  CrossRefTrendPoint,
} from "@/components/cross-ref/types"
import {
  extractBiblePassagesFromDoc,
  type ExtractedBiblePassage,
} from "@/lib/note-bible-passages"
import {
  passagesMatch,
  type NoteCrossRefRow,
} from "@/lib/note-cross-refs"

const TOP_PASSAGES_CAP = 8
const TREND_WEEKS = 8

function normalizeReference(s: string): string {
  return s.trim().toLowerCase()
}

function canonicalPassageKey(p: ExtractedBiblePassage): string | null {
  if (p.source === "biblePassage") {
    const u = p.usfm.trim()
    if (u.length > 0) return `usfm:${u.toUpperCase()}`
  }
  const r = normalizeReference(p.reference)
  if (r.length > 0) return `ref:${r}`
  return null
}

function passageLabel(p: ExtractedBiblePassage): string {
  const ref = p.reference.trim()
  if (ref.length > 0) return ref
  if (p.source === "biblePassage") {
    const u = p.usfm.trim()
    if (u.length > 0) return u
  }
  return "Passage"
}

/** Monday 00:00:00.000 UTC of the week containing `d` (ISO week-style). */
function startOfUtcWeek(d: Date): Date {
  const x = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  )
  const day = x.getUTCDay()
  const daysSinceMonday = (day + 6) % 7
  x.setUTCDate(x.getUTCDate() - daysSinceMonday)
  x.setUTCHours(0, 0, 0, 0)
  return x
}

function formatUtcWeekLabel(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

export function computeScriptureDashboardAggregates(notes: NoteCrossRefRow[]): {
  stats: CrossRefDashboardStats
  topPassages: CrossRefTopPassageRow[]
  trend: CrossRefTrendPoint[]
} {
  type NotePassages = {
    id: string
    updatedAt: Date
    passages: ExtractedBiblePassage[]
  }

  const byNote: NotePassages[] = notes.map((n) => ({
    id: n.id,
    updatedAt: n.updatedAt,
    passages: extractBiblePassagesFromDoc(
      n.content as JSONContent | null | undefined,
    ),
  }))

  const notesWithScripture = byNote.filter((b) => b.passages.length > 0).length
  const passageInstances = byNote.reduce((s, b) => s + b.passages.length, 0)

  let notesLinkedBySharedPassages = 0
  for (const a of byNote) {
    if (a.passages.length === 0) continue
    let linked = false
    for (const b of byNote) {
      if (a.id === b.id || b.passages.length === 0) continue
      outer: for (const pa of a.passages) {
        for (const pb of b.passages) {
          if (passagesMatch(pa, pb)) {
            linked = true
            break outer
          }
        }
      }
      if (linked) break
    }
    if (linked) notesLinkedBySharedPassages++
  }

  const keyToLabel = new Map<string, string>()
  const keyToNoteIds = new Map<string, Set<string>>()

  for (const n of byNote) {
    for (const p of n.passages) {
      const key = canonicalPassageKey(p)
      if (!key) continue
      if (!keyToLabel.has(key)) {
        keyToLabel.set(key, passageLabel(p))
      }
      let set = keyToNoteIds.get(key)
      if (!set) {
        set = new Set<string>()
        keyToNoteIds.set(key, set)
      }
      set.add(n.id)
    }
  }

  const topPassages: CrossRefTopPassageRow[] = [...keyToNoteIds.entries()]
    .map(([key, ids]) => ({
      key,
      label: keyToLabel.get(key) ?? key,
      count: ids.size,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, TOP_PASSAGES_CAP)

  const now = new Date()
  const thisWeekStart = startOfUtcWeek(now)
  const trend: CrossRefTrendPoint[] = []
  for (let w = TREND_WEEKS - 1; w >= 0; w--) {
    const weekStart = new Date(thisWeekStart)
    weekStart.setUTCDate(weekStart.getUTCDate() - w * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 7)

    const value = byNote.filter((n) => {
      if (n.passages.length === 0) return false
      const u = n.updatedAt
      return u >= weekStart && u < weekEnd
    }).length

    trend.push({
      weekLabel: formatUtcWeekLabel(weekStart),
      value,
    })
  }

  return {
    stats: {
      notesWithScripture,
      passageInstances,
      notesLinkedBySharedPassages,
    },
    topPassages,
    trend,
  }
}
