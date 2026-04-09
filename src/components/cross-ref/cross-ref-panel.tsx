"use client"

import Link from "next/link"
import { X } from "lucide-react"
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type RefObject,
} from "react"

import { cn } from "@/lib/utils"

import type {
  CrossRefPanelStatus,
  CrossRefPassageChip,
  CrossRefRelatedNote,
} from "./types"

function formatRelativeUpdated(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ""
  const diffMs = Date.now() - then
  const days = Math.floor(diffMs / 86400000)
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function PassageChip({ passage }: { passage: CrossRefPassageChip }) {
  const sub =
    passage.versionTitle && passage.reference
      ? `${passage.reference} · ${passage.versionTitle}`
      : passage.reference || passage.usfm
  return (
    <span
      className="inline-flex max-w-full items-center rounded-md border bg-muted/60 px-2 py-0.5 text-xs text-foreground"
      title={passage.usfm || undefined}
    >
      <span className="truncate">{sub}</span>
    </span>
  )
}

export type CrossRefPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** For focus restoration when the panel closes. */
  triggerRef?: RefObject<HTMLElement | null>
  panelId?: string
  currentNoteId: string
  passagesInNote: CrossRefPassageChip[]
  relatedNotes: CrossRefRelatedNote[]
  status: CrossRefPanelStatus
  errorMessage?: string
}

export function CrossRefPanel({
  open,
  onOpenChange,
  triggerRef,
  panelId: panelIdProp,
  currentNoteId,
  passagesInNote,
  relatedNotes,
  status,
  errorMessage,
}: CrossRefPanelProps) {
  const autoId = useId()
  const panelId = panelIdProp ?? `cross-ref-panel-${autoId}`
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        handleClose()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, handleClose])

  useEffect(() => {
    if (!open) {
      const el = triggerRef?.current
      if (el && typeof el.focus === "function") {
        window.requestAnimationFrame(() => el.focus())
      }
      return
    }
    closeButtonRef.current?.focus()
  }, [open, triggerRef])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    const getFocusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => el.offsetParent !== null || el === closeButtonRef.current,
      )

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      const focusables = getFocusables()
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    panel.addEventListener("keydown", onKeyDown)
    return () => panel.removeEventListener("keydown", onKeyDown)
  }, [open])

  if (!open) return null

  const showList =
    (status === "ready" || status === "idle") && relatedNotes.length > 0
  const showEmpty =
    (status === "ready" || status === "idle") &&
    relatedNotes.length === 0 &&
    passagesInNote.length > 0
  const showNoPassagesEmpty =
    (status === "ready" || status === "idle") &&
    passagesInNote.length === 0

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        aria-hidden
        tabIndex={-1}
        onClick={handleClose}
      />
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${panelId}-title`}
        className={cn(
          "relative flex h-dvh max-h-dvh w-[min(100%,22rem)] flex-col border-l bg-background shadow-lg sm:max-w-sm sm:w-full md:max-w-md",
          "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-2 border-b px-4 py-3">
          <div className="min-w-0">
            <h2
              id={`${panelId}-title`}
              className="text-base font-semibold tracking-tight text-foreground"
            >
              Cross-references
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Notes that quote the same passage ranges as this note.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-md border bg-background text-foreground hover:bg-muted"
            aria-label="Close cross-references"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          {status === "loading" ? (
            <div className="space-y-3" aria-busy="true" aria-live="polite">
              <p className="text-xs text-muted-foreground">Loading…</p>
              <div className="space-y-2">
                <div className="h-10 animate-pulse rounded-md bg-muted" />
                <div className="h-10 animate-pulse rounded-md bg-muted" />
                <div className="h-10 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
          ) : null}

          {status === "error" ? (
            <div
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {errorMessage?.trim() ||
                "Something went wrong while loading cross-references."}
            </div>
          ) : null}

          {(status === "ready" || status === "idle") && (
            <>
              {passagesInNote.length > 0 ? (
                <section className="mb-4" aria-label="Passages in this note">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    In this note
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {passagesInNote.map((p) => (
                      <PassageChip
                        key={`${p.usfm}-${p.reference}-${p.versionTitle ?? ""}`}
                        passage={p}
                      />
                    ))}
                  </div>
                </section>
              ) : null}

              {showNoPassagesEmpty ? (
                <p className="text-sm text-muted-foreground">
                  Add scripture from the toolbar to see cross-references here.
                </p>
              ) : null}

              {showEmpty ? (
                <p className="text-sm text-muted-foreground">
                  No other notes share these passages yet.
                </p>
              ) : null}

              {showList ? (
                <ul className="space-y-3" aria-label="Related notes">
                  {relatedNotes.map((note) => (
                    <li key={note.noteId}>
                      <Link
                        href={`/notes/${note.noteId}`}
                        onClick={() => onOpenChange(false)}
                        className={cn(
                          "block rounded-lg border bg-card p-3 text-card-foreground shadow-sm transition-colors hover:bg-accent/50",
                          note.noteId === currentNoteId &&
                            "pointer-events-none opacity-50",
                        )}
                        aria-current={
                          note.noteId === currentNoteId ? "page" : undefined
                        }
                      >
                        <p className="font-medium leading-snug">{note.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Updated {formatRelativeUpdated(note.updatedAt)}
                        </p>
                        {note.overlappingPassages.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {note.overlappingPassages.map((p) => (
                              <PassageChip
                                key={`${note.noteId}-${p.usfm}-${p.reference}`}
                                passage={p}
                              />
                            ))}
                          </div>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
