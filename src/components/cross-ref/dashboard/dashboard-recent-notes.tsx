import Link from "next/link"

export type DashboardRecentNote = {
  id: string
  title: string
  updatedAt: Date
}

function formatRelativeUpdated(d: Date): string {
  const then = d.getTime()
  if (Number.isNaN(then)) return ""
  const diffMs = Date.now() - then
  const days = Math.floor(diffMs / 86400000)
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

type Props = {
  notes: DashboardRecentNote[]
}

export function DashboardRecentNotes({ notes }: Props) {
  return (
    <section
      className="mt-6 rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
      aria-labelledby="recent-notes-heading"
    >
      <h2
        id="recent-notes-heading"
        className="text-lg font-semibold tracking-tight text-foreground"
      >
        Recently updated
      </h2>
      {notes.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No notes yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {notes.map((note) => {
            const label = note.title.trim() || "Untitled"
            return (
              <li key={note.id}>
                <Link
                  href={`/notes/${note.id}`}
                  className="block rounded-lg border border-transparent px-1 py-1 transition-colors hover:border-border hover:bg-muted/50"
                >
                  <span className="font-medium text-foreground">{label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Updated {formatRelativeUpdated(note.updatedAt)}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
