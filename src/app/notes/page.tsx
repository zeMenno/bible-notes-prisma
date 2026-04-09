import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { NotesListClient } from "./_components/notes-list-client";

function formatUpdatedAt(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default async function NotesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
  });

  return (
    <div className="min-h-dvh bg-background px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="mx-auto w-full max-w-lg">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              Notes
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {notes.length === 0
                ? "Create your first note."
                : `${notes.length} note${notes.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="inline-flex h-11 min-h-11 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/notes/new"
              className="inline-flex h-11 min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              New note
            </Link>
          </div>
        </header>

        {notes.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">No notes yet.</p>
            <Link
              href="/notes/new"
              className="mt-4 inline-flex h-11 min-h-11 w-full max-w-xs items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground"
            >
              New note
            </Link>
          </div>
        ) : (
          <NotesListClient
            notes={notes.map((note) => ({
              id: note.id,
              title: note.title,
              updatedLabel: formatUpdatedAt(note.updatedAt),
            }))}
          />
        )}
      </div>
    </div>
  );
}
