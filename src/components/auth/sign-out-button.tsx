"use client";

import { useRef, useState } from "react";
import { signOut } from "next-auth/react";

import { ConfirmModalDialog } from "@/components/ui/confirm-modal-dialog";

type SignOutButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export function SignOutButton({ className, children = "Sign out" }: SignOutButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    if (!busy) dialogRef.current?.close();
  }

  async function confirmSignOut() {
    setBusy(true);
    await signOut({ callbackUrl: "/login", redirect: true });
  }

  return (
    <>
      <button type="button" onClick={openDialog} className={className}>
        {children}
      </button>

      <ConfirmModalDialog
        dialogRef={dialogRef}
        title="Sign out?"
        error={null}
        busy={busy}
        busyLabel="Signing out…"
        confirmLabel="Sign out"
        onCancel={closeDialog}
        onConfirm={() => void confirmSignOut()}
      >
        You will need to sign in again to access your notes and dashboard.
      </ConfirmModalDialog>
    </>
  );
}
