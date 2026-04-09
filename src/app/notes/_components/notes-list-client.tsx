"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export type NoteListItem = {
  id: string;
  title: string;
  updatedLabel: string;
};

function DeleteNoteDialog({
  noteTitle,
  dialogRef,
  deleting,
  error,
  onCancel,
  onConfirm,
}: {
  noteTitle: string;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  deleting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 w-[min(calc(100vw-2rem),22rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg backdrop:bg-foreground/20 backdrop:backdrop-blur-[2px]"
      onClose={onCancel}
    >
      <h2 className="text-lg font-semibold tracking-tight">Delete this note?</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        &ldquo;{noteTitle}&rdquo; will be removed permanently. This cannot be undone.
      </p>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={deleting}
          className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium disabled:opacity-60"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={deleting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-white disabled:opacity-60"
          onClick={onConfirm}
        >
          {deleting ? "Deleting…" : "Delete note"}
        </button>
      </div>
    </dialog>
  );
}

function NoteRow({ note }: { note: NoteListItem }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    if (!deleting) dialogRef.current?.close();
  }

  async function confirmDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
      if (!res.ok) {
        setError(
          res.status === 404 ? "This note is no longer available." : "Could not delete the note.",
        );
        return;
      }
      dialogRef.current?.close();
      router.refresh();
    } catch {
      setError("Could not delete the note.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <li>
      <div className="flex min-h-[3.5rem] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        <Link
          href={`/notes/${note.id}`}
          className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3 transition-colors active:bg-accent/50"
        >
          <span className="block truncate font-medium">{note.title}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Updated {note.updatedLabel}
          </span>
        </Link>
        <div className="flex shrink-0 border-l border-border">
          <button
            type="button"
            onClick={openDialog}
            className="inline-flex w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-accent/50 hover:text-destructive active:bg-accent/70"
            aria-label={`Delete note: ${note.title}`}
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <DeleteNoteDialog
        noteTitle={note.title}
        dialogRef={dialogRef}
        deleting={deleting}
        error={error}
        onCancel={closeDialog}
        onConfirm={confirmDelete}
      />
    </li>
  );
}

export function NotesListClient({ notes }: { notes: NoteListItem[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {notes.map((note) => (
        <NoteRow key={note.id} note={note} />
      ))}
    </ul>
  );
}
