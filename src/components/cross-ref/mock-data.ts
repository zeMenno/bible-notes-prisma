import type {
  CrossRefDashboardStats,
  CrossRefPassageChip,
  CrossRefRelatedNote,
  CrossRefTopPassageRow,
  CrossRefTrendPoint,
} from "./types"

export const mockCrossRefPassages: CrossRefPassageChip[] = [
  {
    usfm: "JHN.3.16-18",
    reference: "John 3:16–18",
    versionTitle: "NIV",
  },
]

export const mockCrossRefRelatedNotes: CrossRefRelatedNote[] = [
  {
    noteId: "00000000-0000-4000-8000-000000000001",
    title: "Grace and truth",
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    overlappingPassages: [
      {
        usfm: "JHN.3.16-18",
        reference: "John 3:16–18",
        versionTitle: "NIV",
      },
    ],
  },
  {
    noteId: "00000000-0000-4000-8000-000000000002",
    title: "Sermon prep",
    updatedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    overlappingPassages: [
      {
        usfm: "JHN.3.16",
        reference: "John 3:16",
        versionTitle: "ESV",
      },
    ],
  },
]

export const mockDashboardStats: CrossRefDashboardStats = {
  notesWithScripture: 12,
  passageInstances: 47,
  notesLinkedBySharedPassages: 8,
}

export const mockTopPassages: CrossRefTopPassageRow[] = [
  { key: "jhn316", label: "John 3:16", count: 9 },
  { key: "psa231", label: "Psalm 23:1", count: 6 },
  { key: "rom828", label: "Romans 8:28", count: 5 },
  { key: "php413", label: "Philippians 4:13", count: 4 },
  { key: "mat2819", label: "Matthew 28:19", count: 3 },
]

export const mockTrendPlaceholder: CrossRefTrendPoint[] = [
  { weekLabel: "W1", value: 2 },
  { weekLabel: "W2", value: 5 },
  { weekLabel: "W3", value: 3 },
  { weekLabel: "W4", value: 8 },
  { weekLabel: "W5", value: 4 },
]
