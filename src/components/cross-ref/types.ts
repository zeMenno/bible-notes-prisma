/**
 * Cross-reference UI contract. Server routes and clients should align with these shapes.
 */

export type CrossRefPanelStatus = "idle" | "loading" | "error" | "ready"

/** Passage metadata shown as chips (reference and optional translation label). */
export type CrossRefPassageChip = {
  usfm: string
  reference: string
  versionTitle?: string
}

/** Another note that shares at least one passage with the current note. */
export type CrossRefRelatedNote = {
  noteId: string
  title: string
  updatedAt: string
  /** Matched passages as they appear in this related note (not the open note). */
  overlappingPassages: CrossRefPassageChip[]
}

export type CrossRefDashboardStats = {
  notesWithScripture: number
  passageInstances: number
  notesLinkedBySharedPassages: number
}

/** Row for “top passages” bar chart (label + count). */
export type CrossRefTopPassageRow = {
  key: string
  label: string
  count: number
}

/** Weekly trend placeholder until time-series data exists. */
export type CrossRefTrendPoint = {
  weekLabel: string
  value: number
}

/** Node in GET /api/notes/graph (scripture overlap graph). */
export type NoteGraphNode = {
  id: string
  title: string
  updatedAt: string
  passageCount: number
}

/** Undirected edge: shared scripture between two notes; weight = distinct matching passage pairs. */
export type NoteGraphEdge = {
  source: string
  target: string
  weight: number
}
