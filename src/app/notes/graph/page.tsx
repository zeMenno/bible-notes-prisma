import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { BetaBadge } from "@/components/site/beta-badge";
import { authOptions } from "@/lib/auth";

import { NotesGraphClient } from "./notes-graph-client";

export default async function NotesGraphPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="min-h-dvh bg-background px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex flex-wrap items-center gap-2 font-heading text-2xl font-semibold tracking-tight text-foreground">
              <span>Note graph</span>
              <BetaBadge />
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Scripture links between your notes (beta: layout and filters may change)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/notes"
              className="inline-flex h-11 min-h-11 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium"
            >
              Notes
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 min-h-11 items-center justify-center rounded-md border bg-background px-4 text-sm font-medium"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <NotesGraphClient />
      </div>
    </div>
  );
}
