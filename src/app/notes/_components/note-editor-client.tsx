"use client";

import type { JSONContent } from "@tiptap/core";
import dynamic from "next/dynamic";
import Link from "next/link";
import throttle from "lodash.throttle";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const allowPersist = useRef(false);
  const lastSyncedTitle = useRef(initialTitle);

  useEffect(() => {
    setTitle(initialTitle);
    lastSyncedTitle.current = initialTitle;
  }, [initialTitle, noteId]);

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

  const handleDocumentChange = useCallback(
    (doc: JSONContent) => {
      if (!allowPersist.current) return;
      throttledPatchContent(doc);
    },
    [throttledPatchContent],
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

  return (
    <div className="note-editor-shell flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/notes"
              className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-md border bg-background text-sm font-medium text-foreground"
            >
              ←
            </Link>
            <span
              className="truncate text-xs text-muted-foreground sm:hidden"
              aria-live="polite"
            >
              {saveStatusLabel}
            </span>
          </div>
          <input
            className="min-h-10 w-full rounded-md border bg-background px-3 text-base font-medium text-foreground outline-none ring-ring focus-visible:ring-2"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => saveTitleNow(title)}
            placeholder="Untitled"
            aria-label="Note title"
          />
          <span
            className="hidden shrink-0 text-xs text-muted-foreground sm:inline"
            aria-live="polite"
          >
            {saveStatusLabel}
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <SimpleEditor
          key={noteId}
          initialContent={initialContent}
          onDocumentChange={handleDocumentChange}
        />
      </div>
    </div>
  );
}
