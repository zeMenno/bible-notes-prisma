"use client";

const dialogClassName =
  "fixed top-1/2 left-1/2 w-[min(calc(100vw-2rem),22rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg backdrop:bg-foreground/20 backdrop:backdrop-blur-[2px]";

const confirmButtonClassName =
  "inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-white disabled:opacity-60";

export function ConfirmModalDialog({
  dialogRef,
  title,
  children,
  error,
  busy,
  busyLabel,
  confirmLabel,
  cancelLabel = "Cancel",
  onCancel,
  onConfirm,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  title: string;
  children: React.ReactNode;
  error: string | null;
  busy: boolean;
  busyLabel: string;
  confirmLabel: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <dialog ref={dialogRef} className={dialogClassName} onClose={onCancel}>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={busy}
          className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium disabled:opacity-60"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          disabled={busy}
          className={confirmButtonClassName}
          onClick={onConfirm}
        >
          {busy ? busyLabel : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
