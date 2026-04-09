import type { JSONContent } from "@tiptap/core"

import type { CrossRefPassageChip, NoteGraphEdge, NoteGraphNode } from "@/components/cross-ref/types"
import { extractBiblePassagesFromDoc } from "@/lib/note-bible-passages"
import {
  passageToChip,
  passagesMatch,
  type NoteCrossRefRow,
} from "@/lib/note-cross-refs"

function chipKey(c: CrossRefPassageChip): string {
  return `${c.usfm}\0${c.reference}\0${c.versionTitle ?? ""}`
}

/**
 * Symmetric count of distinct passage pairs (one from each note) that match.
 */
function matchingPassagePairCount(
  passagesA: ReturnType<typeof extractBiblePassagesFromDoc>,
  passagesB: ReturnType<typeof extractBiblePassagesFromDoc>,
): number {
  const pairs = new Set<string>()
  for (const pA of passagesA) {
    for (const pB of passagesB) {
      if (!passagesMatch(pA, pB)) continue
      const ka = chipKey(passageToChip(pA))
      const kb = chipKey(passageToChip(pB))
      const key = ka <= kb ? `${ka}\n${kb}` : `${kb}\n${ka}`
      pairs.add(key)
    }
  }
  return pairs.size
}

export function buildScriptureNoteGraph(notes: NoteCrossRefRow[]): {
  nodes: NoteGraphNode[]
  edges: NoteGraphEdge[]
} {
  const extracted = notes.map((n) => ({
    id: n.id,
    title: n.title,
    updatedAt: n.updatedAt,
    passages: extractBiblePassagesFromDoc(
      n.content as JSONContent | null | undefined,
    ),
  }))

  const nodes: NoteGraphNode[] = extracted.map((n) => ({
    id: n.id,
    title: n.title,
    updatedAt: n.updatedAt.toISOString(),
    passageCount: n.passages.length,
  }))

  const edges: NoteGraphEdge[] = []

  for (let i = 0; i < extracted.length; i++) {
    for (let j = i + 1; j < extracted.length; j++) {
      const a = extracted[i]!
      const b = extracted[j]!
      if (a.passages.length === 0 || b.passages.length === 0) continue

      const weight = matchingPassagePairCount(a.passages, b.passages)
      if (weight < 1) continue

      edges.push({
        source: a.id,
        target: b.id,
        weight,
      })
    }
  }

  return { nodes, edges }
}
