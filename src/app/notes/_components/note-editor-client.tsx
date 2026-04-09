"use client";

import type { JSONContent } from "@tiptap/core";
import dynamic from "next/dynamic";
import Link from "next/link";
import throttle from "lodash.throttle";
import { BookMarked } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CrossRefPanel } from "@/components/cross-ref/cross-ref-panel";
import type {
  CrossRefPanelStatus,
  CrossRefPassageChip,
  CrossRefRelatedNote,
} from "@/components/cross-ref/types";
import { migrateBiblePassageDoc } from "@/lib/note-bible-passages";

const SimpleEditor = dynamic(
  () =>
    import("@/components/tiptap-templates/simple/simple-editor").then((m) => ({
      default: m.SimpleEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading editor…
      </div>
    ),
  },
);

type SaveState = "idle" | "saving" | "saved" | "error";

type Props = {
  noteId: string;
  initialTitle: string;
  initialContent: JSONContent;
};

export function NoteEditorClient({ noteId, initialTitle, initialContent }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [crossRefOpen, setCrossRefOpen] = useState(false);
  const [passagesInNote, setPassagesInNote] = useState<CrossRefPassageChip[]>([]);
  const [relatedNotes, setRelatedNotes] = useState<CrossRefRelatedNote[]>([]);
  const [crossRefStatus, setCrossRefStatus] = useState<CrossRefPanelStatus>("idle");
  const [crossRefError, setCrossRefError] = useState<string | null>(null);
  const [crossRefCount, setCrossRefCount] = useState<number | null>(null);
  const allowPersist = useRef(false);
  const lastSyncedTitle = useRef(initialTitle);
  const crossRefTriggerRef = useRef<HTMLButtonElement>(null);
  const crossRefOpenRef = useRef(false);
  const crossRefAbortRef = useRef<AbortController | null>(null);
  const crossRefPanelId = `note-cross-ref-${noteId}`;

  crossRefOpenRef.current = crossRefOpen;

  const editorInitialContent = useMemo(
    () => migrateBiblePassageDoc(initialContent),
    [initialContent],
  );

  useEffect(() => {
    setTitle(initialTitle);
    lastSyncedTitle.current = initialTitle;
  }, [initialTitle, noteId]);

  useEffect(() => {
    crossRefAbortRef.current?.abort();
    setPassagesInNote([]);
    setRelatedNotes([]);
    setCrossRefCount(null);
    setCrossRefStatus("idle");
    setCrossRefError(null);
  }, [noteId]);

  const fetchCrossRefs = useCallback((mode: "background" | "interactive") => {
    crossRefAbortRef.current?.abort();
    const ac = new AbortController();
    crossRefAbortRef.current = ac;
    if (mode === "interactive") {
      setCrossRefStatus("loading");
    }

    void (async () => {
      try {
        const res = await fetch(`/api/notes/${noteId}/cross-refs`, {
          signal: ac.signal,
        });
        const raw = (await res.json().catch(() => ({}))) as {
          error?: string;
          passagesInCurrentNote?: CrossRefPassageChip[];
          relatedNotes?: CrossRefRelatedNote[];
          crossRefCount?: number;
        };
        if (!res.ok) {
          throw new Error(
            typeof raw.error === "string" ? raw.error : "Request failed",
          );
        }
        if (ac.signal.aborted) return;
        setPassagesInNote(raw.passagesInCurrentNote ?? []);
        setRelatedNotes(raw.relatedNotes ?? []);
        setCrossRefCount(
          typeof raw.crossRefCount === "number"
            ? raw.crossRefCount
            : (raw.relatedNotes?.length ?? 0),
        );
        setCrossRefError(null);
        setCrossRefStatus("ready");
      } catch (e) {
        if (ac.signal.aborted) return;
        if (mode === "interactive") {
          setCrossRefStatus("error");
          setCrossRefError(
            e instanceof Error ? e.message : "Couldn’t load cross-references.",
          );
        }
      }
    })();
  }, [noteId]);

  useEffect(() => {
    fetchCrossRefs("background");
    return () => {
      crossRefAbortRef.current?.abort();
    };
  }, [noteId, fetchCrossRefs]);

  useEffect(() => {
    if (crossRefOpen) {
      fetchCrossRefs("interactive");
    }
  }, [crossRefOpen, fetchCrossRefs]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      allowPersist.current = true;
    }, 450);
    return () => clearTimeout(id);
  }, [noteId]);

  const patchContent = useCallback(
    async (doc: JSONContent) => {
      setSaveState("saving");
      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: doc }),
        });
        if (!res.ok) throw new Error("Save failed");
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    },
    [noteId],
  );

  const throttledPatchContent = useMemo(
    () => throttle(patchContent, 750, { leading: false, trailing: true }),
    [patchContent],
  );

  useEffect(() => () => throttledPatchContent.cancel(), [throttledPatchContent]);

  const throttledFetchCrossRefs = useMemo(
    () =>
      throttle(
        () => {
          fetchCrossRefs(
            crossRefOpenRef.current ? "interactive" : "background",
          );
        },
        750,
        { leading: false, trailing: true },
      ),
    [fetchCrossRefs],
  );

  useEffect(
    () => () => throttledFetchCrossRefs.cancel(),
    [throttledFetchCrossRefs],
  );

  const handleDocumentChange = useCallback(
    (doc: JSONContent) => {
      if (!allowPersist.current) return;
      throttledPatchContent(doc);
      throttledFetchCrossRefs();
    },
    [throttledPatchContent, throttledFetchCrossRefs],
  );

  const saveTitleNow = useCallback(async (nextTitle: string) => {
    const trimmed = nextTitle.trim() || "Untitled";
    if (trimmed === lastSyncedTitle.current) return;
    setSaveState("saving");
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      if (!res.ok) throw new Error("Title save failed");
      lastSyncedTitle.current = trimmed;
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }, [noteId]);

  const throttledSaveTitle = useMemo(
    () => throttle(saveTitleNow, 500, { leading: false, trailing: true }),
    [saveTitleNow],
  );

  useEffect(() => () => throttledSaveTitle.cancel(), [throttledSaveTitle]);

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!allowPersist.current) return;
    throttledSaveTitle(value);
  };

  const saveStatusLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
        ? "Saved"
        : saveState === "error"
          ? "Couldn’t save"
          : "";

  const crossRefAriaLabel =
    crossRefCount === null
      ? "Cross-references"
      : crossRefCount === 0
        ? "Cross-references, no related notes"
        : `Cross-references, ${crossRefCount} related ${
            crossRefCount === 1 ? "note" : "notes"
          }`;

  return (
    <div className="note-editor-shell flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex w-full max-w-3xl flex-row items-center gap-2 sm:gap-3">
          <Link
            href="/notes"
            className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-md border bg-background text-sm font-medium text-foreground"
          >
            ←
          </Link>
          <input
            className="min-h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-base font-medium text-foreground outline-none ring-ring focus-visible:ring-2"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => saveTitleNow(title)}
            placeholder="Untitled"
            aria-label="Note title"
          />
          <div className="relative shrink-0">
            <button
              ref={crossRefTriggerRef}
              type="button"
              onClick={() => setCrossRefOpen((o) => !o)}
              aria-expanded={crossRefOpen}
              aria-controls={crossRefPanelId}
              aria-label={crossRefAriaLabel}
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-md border bg-background text-foreground hover:bg-muted"
            >
              <BookMarked className="h-4 w-4" aria-hidden />
            </button>
            {crossRefCount !== null && crossRefCount > 0 ? (
              <span
                className="pointer-events-none absolute -right-1 -top-1 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-semibold leading-none text-primary-foreground"
                aria-hidden
              >
                {crossRefCount > 9 ? "9+" : crossRefCount}
              </span>
            ) : null}
          </div>
          {saveStatusLabel ? (
            <span
              className="max-w-[4.5rem] shrink-0 truncate text-right text-xs text-muted-foreground sm:max-w-[10rem]"
              aria-live="polite"
              title={saveStatusLabel}
            >
              {saveStatusLabel}
            </span>
          ) : null}
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <SimpleEditor
          key={noteId}
          layout="embedded"
          initialContent={editorInitialContent}
          onDocumentChange={handleDocumentChange}
        />
      </div>

      <CrossRefPanel
        open={crossRefOpen}
        onOpenChange={setCrossRefOpen}
        triggerRef={crossRefTriggerRef}
        panelId={crossRefPanelId}
        currentNoteId={noteId}
        passagesInNote={passagesInNote}
        relatedNotes={relatedNotes}
        status={crossRefStatus}
        errorMessage={crossRefError ?? undefined}
      />
    </div>
  );
}
