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
