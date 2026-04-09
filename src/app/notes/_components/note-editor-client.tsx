"use client";

import type { JSONContent } from "@tiptap/core";
import dynamic from "next/dynamic";
import Link from "next/link";
import throttle from "lodash.throttle";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const allowPersist = useRef(false);
  const lastSyncedTitle = useRef(initialTitle);

  const editorInitialContent = useMemo(
    () => migrateBiblePassageDoc(initialContent),
    [initialContent],
  );

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
    </div>
  );
}
