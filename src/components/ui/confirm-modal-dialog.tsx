"use client";

const dialogClassName =
  "fixed top-1/2 left-1/2 w-[min(calc(100vw-2rem),22rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg backdrop:bg-foreground/20 backdrop:backdrop-blur-[2px]";

const actionButtonBase =
  "box-border inline-flex h-10 min-h-10 shrink-0 items-center justify-center rounded-md px-4 text-sm font-medium leading-none disabled:opacity-60";

const confirmButtonVariants = {
  primary: `${actionButtonBase} bg-primary text-primary-foreground transition-opacity hover:opacity-90`,
  destructive: `${actionButtonBase} bg-destructive text-white`,
} as const;

export function ConfirmModalDialog({
  dialogRef,
  title,
  children,
  error,
  busy,
  busyLabel,
  confirmLabel,
  cancelLabel = "Cancel",
  confirmVariant = "destructive",
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
  confirmVariant?: keyof typeof confirmButtonVariants;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <dialog ref={dialogRef} className={dialogClassName} onClose={onCancel}>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      <div className="mt-6 flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          disabled={busy}
          className={`${actionButtonBase} border border-border bg-background`}
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          disabled={busy}
          className={confirmButtonVariants[confirmVariant]}
          onClick={onConfirm}
        >
          {busy ? busyLabel : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
