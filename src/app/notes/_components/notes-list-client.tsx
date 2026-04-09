"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { ConfirmModalDialog } from "@/components/ui/confirm-modal-dialog";

export type NoteListItem = {
  id: string;
  title: string;
  updatedLabel: string;
};

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
      <ConfirmModalDialog
        dialogRef={dialogRef}
        title="Delete this note?"
        error={error}
        busy={deleting}
        busyLabel="Deleting…"
        confirmLabel="Delete note"
        onCancel={closeDialog}
        onConfirm={confirmDelete}
      >
        &ldquo;{note.title}&rdquo; will be removed permanently. This cannot be undone.
      </ConfirmModalDialog>
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
