import type { JSONContent } from "@tiptap/core"

import { parseUsfmPassageRange } from "@/lib/bible-usfm"
import {
  extractBiblePassagesFromDoc,
  type ExtractedBiblePassage,
} from "@/lib/note-bible-passages"

import type { CrossRefPassageChip, CrossRefRelatedNote } from "@/components/cross-ref/types"

export type NoteCrossRefRow = {
  id: string
  title: string
  updatedAt: Date
  content: unknown
}

function normalizeReference(s: string): string {
  return s.trim().toLowerCase()
}

function usfmRangesOverlap(a: string, b: string): boolean {
  const pa = parseUsfmPassageRange(a)
  const pb = parseUsfmPassageRange(b)
  if (!pa || !pb) return false
  if (pa.bookId !== pb.bookId || pa.chapter !== pb.chapter) return false
  return Math.max(pa.verseFrom, pb.verseFrom) <= Math.min(pa.verseTo, pb.verseTo)
}

export function passagesMatch(a: ExtractedBiblePassage, b: ExtractedBiblePassage): boolean {
  const refMatch =
    normalizeReference(a.reference).length > 0 &&
    normalizeReference(a.reference) === normalizeReference(b.reference)

  if (a.source === "biblePassage" && b.source === "biblePassage") {
    const ua = a.usfm.trim()
    const ub = b.usfm.trim()
    if (ua.length > 0 && ub.length > 0) {
      return usfmRangesOverlap(ua, ub)
    }
    return refMatch
  }

  if (a.source === "legacyBlockquote" && b.source === "legacyBlockquote") {
    return refMatch
  }

  return refMatch
}

export function passageToChip(p: ExtractedBiblePassage): CrossRefPassageChip {
  if (p.source === "biblePassage") {
    return {
      usfm: p.usfm,
      reference: p.reference,
      ...(p.versionTitle ? { versionTitle: p.versionTitle } : {}),
    }
  }
  return {
    usfm: "",
    reference: p.reference,
    ...(p.versionTitle ? { versionTitle: p.versionTitle } : {}),
  }
}

function chipKey(c: CrossRefPassageChip): string {
  return `${c.usfm}\0${c.reference}\0${c.versionTitle ?? ""}`
}

function dedupeChips(chips: CrossRefPassageChip[]): CrossRefPassageChip[] {
  const seen = new Set<string>()
  const out: CrossRefPassageChip[] = []
  for (const c of chips) {
    const k = chipKey(c)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(c)
  }
  return out
}

/**
 * Computes cross-references for one note against all notes in `notes` (same user).
 */
export function computeCrossRefsForNote(
  currentNoteId: string,
  notes: NoteCrossRefRow[],
): {
  passagesInCurrentNote: CrossRefPassageChip[]
  relatedNotes: CrossRefRelatedNote[]
  crossRefCount: number
} {
  const current = notes.find((n) => n.id === currentNoteId)
  if (!current) {
    return { passagesInCurrentNote: [], relatedNotes: [], crossRefCount: 0 }
  }

  const doc = current.content as JSONContent | null | undefined
  const extractedCurrent = extractBiblePassagesFromDoc(doc)
  const passagesInCurrentNote = dedupeChips(extractedCurrent.map(passageToChip))

  const relatedNotes: CrossRefRelatedNote[] = []

  for (const other of notes) {
    if (other.id === currentNoteId) continue

    const extractedOther = extractBiblePassagesFromDoc(
      other.content as JSONContent | null | undefined,
    )
    if (extractedOther.length === 0) continue

    const overlapping: CrossRefPassageChip[] = []

    for (const pO of extractedOther) {
      const matched = extractedCurrent.some((pC) => passagesMatch(pC, pO))
      if (matched) overlapping.push(passageToChip(pO))
    }

    const uniqueOverlap = dedupeChips(overlapping)
    if (uniqueOverlap.length === 0) continue

    relatedNotes.push({
      noteId: other.id,
      title: other.title,
      updatedAt: other.updatedAt.toISOString(),
      overlappingPassages: uniqueOverlap,
    })
  }

  relatedNotes.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  return {
    passagesInCurrentNote,
    relatedNotes,
    crossRefCount: relatedNotes.length,
  }
}
