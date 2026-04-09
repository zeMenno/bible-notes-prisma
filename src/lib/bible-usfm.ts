export function chapterNumberFromApi(chapter: { id: string; title: string }): number {
  const fromTitle = parseInt(chapter.title.trim(), 10)
  if (!Number.isNaN(fromTitle) && fromTitle > 0) return fromTitle
  const tail = chapter.id.split(".").pop()
  const n = tail ? parseInt(tail, 10) : NaN
  if (!Number.isNaN(n) && n > 0) return n
  return 1
}

export function verseNumberFromApi(verse: { title: string }, index: number): number {
  const n = parseInt(verse.title.trim(), 10)
  if (!Number.isNaN(n) && n > 0) return n
  return index + 1
}

/**
 * Build a same-chapter USFM reference for YouVersion `getPassage`, e.g. JHN.3.16 or JHN.3.16-18.
 */
export function buildUsfmPassageRange(
  bookId: string,
  chapter: number,
  verseFrom: number,
  verseTo: number,
): string | null {
  const book = bookId.trim().toUpperCase()
  if (!book || chapter < 1 || verseFrom < 1 || verseTo < 1) return null

  const a = Math.min(verseFrom, verseTo)
  const b = Math.max(verseFrom, verseTo)

  if (a === b) {
    return `${book}.${chapter}.${a}`
  }
  return `${book}.${chapter}.${a}-${b}`
}

const USFM_SAME_CHAPTER =
  /^([A-Za-z0-9]+)\.(\d+)\.(\d+)(?:-(\d+))?$/

export type ParsedUsfmPassageRange = {
  bookId: string
  chapter: number
  verseFrom: number
  verseTo: number
}

/**
 * Parse same-chapter USFM produced by {@link buildUsfmPassageRange}, e.g. `JHN.3.16` or `JHN.3.16-18`.
 * Returns `null` if the string does not match that shape.
 */
export function parseUsfmPassageRange(usfm: string): ParsedUsfmPassageRange | null {
  const trimmed = usfm.trim()
  const m = USFM_SAME_CHAPTER.exec(trimmed)
  if (!m) return null

  const bookId = m[1].toUpperCase()
  const chapter = parseInt(m[2], 10)
  const v1 = parseInt(m[3], 10)
  const v2 = m[4] != null ? parseInt(m[4], 10) : v1

  if (
    !bookId ||
    Number.isNaN(chapter) ||
    Number.isNaN(v1) ||
    Number.isNaN(v2) ||
    chapter < 1 ||
    v1 < 1 ||
    v2 < 1
  ) {
    return null
  }

  const verseFrom = Math.min(v1, v2)
  const verseTo = Math.max(v1, v2)
  return { bookId, chapter, verseFrom, verseTo }
}
